# -*- coding: utf-8 -*-
import csv
import sys
import math
import random

nt = ['A','C','G','T']
    
dictFile = open('../GRCh37.tsv','r') #染色体のlist
tsv = csv.reader(dictFile, delimiter = '\t')

chr_name = []
chr_len = []
for s in tsv:
    chr_name.append(s[0])
    chr_len.append(int(s[1]))

sampling_rate = [0.0001,0.001,0.01]
#sampling_rate = [0.000001]

for r in sampling_rate:
    with open("sample_genome-" + str(r)+".bed","w",newline="") as f:
        writer = csv.writer(f, delimiter="\t", quotechar='"', quoting=csv.QUOTE_MINIMAL)
        for name,length in zip(chr_name,chr_len):
            samples = random.sample(range(length), math.floor(length*r))
            samples.sort()
            for sample in samples:
                writer.writerow(['chr'+name,sample,sample+1,nt[random.randint(0,3)]])
