# -*- coding: utf-8 -*-
import csv
import sys

def nt2i(nt):
    if nt == 'A':
        return 0
    elif nt == 'C':
        return 1
    elif nt == 'G':
        return 2
    elif nt == 'T':
        return 3
    else:
        return -1

argv = sys.argv
argc = len(argv)

if argc <= 3:
    print("python bed2list.py <tsv> <bed> <directory for output>")
    exit()

dictFile = open(argv[1],'r') #染色体のlist
tsv = csv.reader(dictFile, delimiter = '\t')

DNAlen = 0
for s in tsv:
    DNAlen = DNAlen + int(s[1])

bedFile = open(argv[2],'r') #bedfile
tsv = csv.reader(bedFile, delimiter = '\t')


chrdict = {"chr1":1,"chr2":2,"chr3":3,"chr4":4,"chr5":5,"chr6":6,"chr7":7,"chr8":8,"chr9":9,"chr10":10,"chr11":11,"chr12":12,"chr13":13,"chr14":14,"chr15":15,"chr16":16,"chr17":17,"chr18":18,"chr19":19,"chr20":20,"chr21":21,"chr22":22,"chrX":23,"chrY":24,"chrM":25}

vlist = [[] for i in range(25)]

for s in tsv:
    nt = nt2i(s[3])
    if nt >= 0:
        pos = int(s[2])*4 + nt #1-base
        vlist[chrdict[s[0]]-1].append(pos)

total_M = 0
for i in range(25):
    vlist[i].sort()
    total_M += len(vlist[i])

filename = argv[3] + "M.dat"
f = open(filename,'w')
f.write(str(total_M) + '\n')
f.close()

for i in range(25):
    filename = argv[3] + str(i+1) + ".pos"
    f = open(filename,'w')
    f.write(str(len(vlist[i])) + '\n')
    for v in vlist[i]:
        f.write(str(v) + '\n')
    f.close()
