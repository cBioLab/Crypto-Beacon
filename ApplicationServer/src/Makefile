TOPDIR:=$(realpath $(dir $(lastword $(MAKEFILE_LIST))))/
CFLAGS= -O3 -g
CFLAGS+= -I$(TOPDIR)include -I$(TOPDIR)../../cybozulib/include/ -I$(TOPDIR)../../mcl/include -I$(TOPDIR)../../xbyak/  -I$(TOPDIR)cpp-base64/
LDFLAGS+= -lgmp -lgmpxx  -L../../mcl/lib/ -lcrypto -lmcl

BASE_OBJ=cpp-base64/base64.o
SHE_OBJS=she_server_core.o
MCL_LIB=../../mcl/lib/libmcl.a

all: $(BASE_OBJ) $(MCL_LIB) she_server_core

../../mcl/lib/libmcl.a:
	make -C ../../mcl USE_LLVM=0

clean:
	rm -rf ../bin/* ../src/*.o cpp-base64/*.o

.SUFFIXES: .cpp

.cpp.o:
	$(CXX) -c $< -o $@ $(CFLAGS) -fopenmp

cpp-base64/base64.o:
	$(CXX) -O3 -g -c cpp-base64/base64.cpp -o cpp-base64/base64.o

she_server_core: $(SHE_OBJS) $(MCL_LIB) $(BASE_OBJ)
	mkdir -p ../bin/
	$(CXX) $(SHE_OBJS) $(BASE_OBJ) -o $@ $(LDFLAGS) -fopenmp
	mv she_server_core $(TOPDIR)../bin/
