#include <iostream>
#include <fstream>
#include <ostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <sstream>

#include <omp.h>

#include <cybozu/random_generator.hpp> 
#include <sys/time.h>
#include <mcl/she.hpp>

#include "cpp-base64/base64.h"

#define IOMODE mcl::IoFixedSizeByteSeq
#define DATABASE 1

using namespace mcl::she;
using namespace mcl::bn;

cybozu::RandomGenerator rg; 

double get_wall_time(){
  struct timeval time;
  if (gettimeofday(&time, NULL)){
    return 0;
  }
  return (double)time.tv_sec + (double)time.tv_usec * .000001;
}

template <typename T> std::string tostr(const T& t){
  std::ostringstream os; os<<t; return os.str();
}

char btoc(char i){
  if(i>=0 && i<=9) return (i+'0');
  if(i>=10 && i<=16) return (i+'a'-10);
  std::cerr << "error" << std::endl;
  return -1;
}

char ctob(char c){
  if(c >= '0' && c <= '9'){
    return (c-'0');
  }
  if(c >= 'a' && c <= 'f'){
    return (c-'a'+10);
  }
  if(c >= 'A' && c <= 'F'){
    return (c-'A'+10);
  }
  std::cerr << "error" << std::endl;
  return -1;
}


void serialize(std::string& l){
  std::string s(l.size()/2,0);
  for(int i=0;i<s.size();i++){
    s[i] = (ctob(l[2*i])<<4)|(ctob(l[2*i+1]));
  }
  l = s;
}

void deserialize(std::string& l){
  std::string s(l.size()*2,0);
  for(int i=0;i<l.size();i++){
    s[2*i] = btoc((l[i]>>4)&15);
    s[2*i+1] = btoc(l[i]&15);
  }
  l = s;
}

bool checkZkpG1(PublicKey &pub, std::vector<CipherTextG1> &ctVec, std::vector<ZkpBin> &zkpVec){
  int length = ctVec.size();
  for(int i=0;i<length;i++){
    if(!pub.verify(ctVec[i],zkpVec[i])) return false;
  }
  return true;
}

bool checkZkpG2(PublicKey &pub, std::vector<CipherTextG2> &ctVec, std::vector<ZkpBin> &zkpVec){
  int length = ctVec.size();
  for(int i=0;i<length;i++){
    if(!pub.verify(ctVec[i],zkpVec[i])) return false;
  }
  return true;
}

bool find(std::vector<uint64_t> &v, uint64_t n, uint64_t &index){
  for(int i=index;i<v.size();i++){
    if(v[i] < n) continue;
    if(v[i] == n){
      index = i;
      return true;
    }
    if(v[i] > n){
      index = i;
      return false;
    }
  }
  return false;
}

uint64_t setPoint(std::vector<uint64_t> &v,uint64_t p){
  uint64_t st,en,mid;
  st = mid = 0;
  en = v.size();
  if(!en) return st;
  while(st+1  < en){
    mid = (st + en) / 2;
    if(v[mid] < p){
      st = mid + 1;
      continue;
    }
    if(v[mid] > p){
      en = mid;
      continue;
    }
    return mid;
  }
  if(v[st] < p) return en;
  return st;
}

void searchDBwAHE(uint64_t x,uint64_t y,std::vector<uint64_t>& list,PublicKey& pub,std::vector<CipherTextG1>& G1Vec,CipherTextG1& cG1,std::string& outfile){
  std::vector<CipherTextG1> vecAns;
  vecAns.resize(y);
  omp_set_nested(1);
  omp_set_num_threads(4);
  #pragma omp parallel for
  for(int i=0;i<y;i++){
    uint64_t p = x*i;
    uint64_t point = setPoint(list,p);
    bool b = false;
    CipherTextG1 c1;
    for(int j=0;j<x;j++){
      if(find(list,p++,point)){
	if(b){
	  c1.add(G1Vec[j]);
	}else{
	  c1 = G1Vec[j];
	  b = true;
	}
      }
    }
    CipherTextG1 index;
    pub.enc(index,i);
    CipherTextG1::sub(index,index,cG1);
    Fr rn;
    rn.setRand(rg);
    CipherTextG1::mul(index,index,rn);
    if(b){
      CipherTextG1::add(vecAns[i],c1,index);
    }else{
      vecAns[i] = index;
    }
  }
  std::string s,t;
  std::ofstream ofs(outfile.c_str()); 
  for(int i=0;i<y;i++){
    s = vecAns[i].getStr(IOMODE);
    t = base64_encode(reinterpret_cast<const unsigned char *>(s.c_str()),s.size());
    ofs << t << "\n";
  }
  ofs.close();
}

void searchDBwSHE(uint64_t x,uint64_t y,uint64_t z,std::vector<uint64_t>& list,PublicKey& pub,std::vector<CipherTextG1>& G1Vec,std::vector<CipherTextG2>& G2Vec,CipherTextGT& cGT,std::string& outfile){
  std::vector<CipherTextGT> vecGT;
  vecGT.resize(z);
  omp_set_nested(1);
  omp_set_num_threads(6);
  #pragma omp parallel for
  for(int i=0;i<z;i++){
    uint64_t p = x*y*i;
    uint64_t point = setPoint(list,p);
    bool isGT = false;
    for(int j=0;j<y;j++){
      CipherTextG1 c1;
      bool b = false;
      for(int k=0;k<x;k++){
	if(find(list,p++,point)){
	  if(b){
	    c1.add(G1Vec[k]);
	  }else{
	    c1 = G1Vec[k];
	    b = true;
	  }
	}
      }
      if(b){
	  CipherTextGT ct;
	  CipherTextGT::mulML(ct,c1,G2Vec[j]);
	if(isGT){
	  CipherTextGT::add(vecGT[i],vecGT[i],ct);
	}else{
	  vecGT[i] = ct;
	  isGT = true;
	}
      }
    }
    CipherTextGT index;
    CipherTextGT randvec[4];
    pub.enc(index,i);
    CipherTextGT::sub(index,index,cGT);
    for(int j=0;j<4;j++){
      CipherTextGT::mul(randvec[j],index,rg.get64());
      int count = 64 * j;
      for(int k=0;k<=j;k++){
	if(count >= 64){
	  count -= 63;
	  CipherTextGT::mul(randvec[j],randvec[j],(int64_t)1<<63);
	}else{
	  count = 0;
	  CipherTextGT::mul(randvec[j],randvec[j],(int64_t)1<<count);
	}
      }
      if(j>0){
	CipherTextGT::add(randvec[0],randvec[0],randvec[j]);
      }
    }
    if(isGT){
      CipherTextGT::finalExp(vecGT[i], vecGT[i]);
      CipherTextGT::add(vecGT[i],vecGT[i],randvec[0]);
    }else{
      vecGT[i] = randvec[0];
    }
  }
  std::string s,t;
  std::ofstream ofs(outfile.c_str()); 
  for(int i=0;i<z;i++){
    s = vecGT[i].getStr(IOMODE);
    t = base64_encode(reinterpret_cast<const unsigned char *>(s.c_str()),s.size());
    ofs << t << "\n";
  }
  ofs.close();
}

int main(int argc,char* argv[]){
  SHE::init();
  PublicKey pub;
  std::string inputline;
  std::string binput;
  CipherTextG1 cG1;
  CipherTextGT cGT;

  int chr;
  uint64_t lengthG1,lengthG2,lengthGT,lengthX,lengthY;
  int chrflag,HEflag;
  std::string dataPATH("../data/");

  std::string tableFile = dataPATH + "GRCh37.tsv";
  std::ifstream ifstsv(tableFile.c_str());
  uint64_t total_len = 0;
  std::string s;
  std::vector<uint64_t> chrnt;
  chrnt.resize(25);
  for(int i=0;i<25;i++){
    for(int j=0;j<4;j++){
      if(j == 1){
	ifstsv >> chrnt[i];
	total_len += chrnt[i];
      }else{
	ifstsv >> s;
      }
    }
  }
  ifstsv.close();

  std::cout << argv[1];

  uint64_t mid,M;
  std::ifstream ifs(argv[1]);
  std::vector<uint64_t> l;
  ifs >> chr;
  ifs >> chrflag;
  ifs >> HEflag;
  std::string posPATH;
  ifs >> posPATH;
  
  if(chrflag){
    uint64_t total_M;
    std::string MFileName = posPATH + "M.dat";
    std::string MPATH = dataPATH + MFileName;
    std::ifstream ifsM(MPATH.c_str());
    ifsM >> total_M;
    ifsM.close();
    l.resize(total_M);
    total_M = 0;
    uint64_t sum_len = 0;
    for(int i=1;i<=25;i++){
      std::string fileName = posPATH + tostr(i) + ".pos";
      std::string filePATH = dataPATH + fileName;
      std::ifstream ifsfile(filePATH.c_str());
      uint64_t M;
      ifsfile >> M;
      for(int j=0;j<M;j++){
	ifsfile >> l[j+total_M];
	l[j+total_M] += sum_len;
      }
      total_M += M;
      sum_len += chrnt[i-1] * 4;
      ifsfile.close();
    }
  }else{
    std::string fileName = posPATH + tostr(chr) + ".pos";
    std::string filePATH = dataPATH + fileName;
    std::ifstream ifsfile(filePATH.c_str());
    uint64_t M;
    ifsfile >> M;
    l.resize(M);
    for(int i=0;i<M;i++){
      ifsfile >> l[i];
    }
  }

  if(!chrflag) total_len = chrnt[chr-1];

  std::vector<CipherTextG1> G1Vec;
  std::vector<CipherTextG2> G2Vec;
  std::vector<ZkpBin> zkp_G1Vec;
  std::vector<ZkpBin> zkp_G2Vec;

  if(HEflag){
    mid = std::ceil(std::pow(std::ceil(total_len / 18),(1.0/3)));
    lengthGT = mid;
    lengthG1 = mid * 12;
    lengthG2 = mid * 6;
    G1Vec.resize(lengthG1);
    G2Vec.resize(lengthG2);
    zkp_G1Vec.resize(lengthG1);
    zkp_G2Vec.resize(lengthG2);
  }else{
    lengthX = 10000;
    lengthY = std::ceil(total_len/2500.0);
    G1Vec.resize(lengthX);
    zkp_G1Vec.resize(lengthX);
  }
  
  ifs >> inputline;
  binput = base64_decode(inputline);
  pub.setStr(binput,IOMODE);

  if(HEflag){
    for(int i=0;i<lengthG1;i++){
      ifs >> inputline;
      binput = base64_decode(inputline);
      G1Vec[i].setStr(binput,IOMODE);
    }
    for(int i=0;i<lengthG2;i++){
      ifs >> inputline;
      binput = base64_decode(inputline);
      G2Vec[i].setStr(binput,IOMODE);
    }
    ifs >> inputline;
    binput = base64_decode(inputline);
    cGT.setStr(binput,IOMODE);
    for(int i=0;i<lengthG1;i++){
      ifs >> inputline;
      binput = base64_decode(inputline);
      zkp_G1Vec[i].setStr(binput,IOMODE);
    }
    for(int i=0;i<lengthG2;i++){
      ifs >> inputline;
      binput = base64_decode(inputline);
      zkp_G2Vec[i].setStr(binput,IOMODE);
    }
    if(!checkZkpG1(pub,G1Vec,zkp_G1Vec)){
      std::cerr << "G1 verify failed" << std::endl;
      ifs.close();
      return -1;
    }
    if(!checkZkpG2(pub,G2Vec,zkp_G2Vec)){
      std::cerr << "G2 verify failed" << std::endl;
      ifs.close();
      return -1;
    }
  }else{
    for(int i=0;i<lengthX;i++){
      ifs >> inputline;
      binput = base64_decode(inputline);
      G1Vec[i].setStr(binput,IOMODE);
    }
    ifs >> inputline;
    binput = base64_decode(inputline);
    cG1.setStr(binput,IOMODE);
    for(int i=0;i<lengthX;i++){
      ifs >> inputline;
      binput = base64_decode(inputline);
      zkp_G1Vec[i].setStr(binput,IOMODE);
    }
    if(!checkZkpG1(pub,G1Vec,zkp_G1Vec)){
      std::cerr << "G1 verify failed" << std::endl;
      ifs.close();
      return -1;
    }
  }
  ifs.close();

  //HEflag,chrflagの区別をすれば拡張可能
  std::string outfile = std::string("ans_") + argv[1];
  if(HEflag){
    searchDBwSHE(lengthG1,lengthG2,lengthGT,l,pub,G1Vec,G2Vec,cGT,outfile);
  }else{
    searchDBwAHE(lengthX,lengthY,l,pub,G1Vec,cG1,outfile);
  }


  return 0;
}
