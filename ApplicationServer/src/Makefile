TOPDIR:=$(realpath $(dir $(lastword $(MAKEFILE_LIST))))/
CFLAGS= -O3 -g
CFLAGS+= -I$(TOPDIR)include -I$(TOPDIR)../../cybozulib/include/ -I$(TOPDIR)../../mcl/include -I$(TOPDIR)../../xbyak/  -I$(TOPDIR)../include/
LDFLAGS+= -lgmp -lgmpxx  -L../../mcl/lib/ -lcrypto -lmcl

SHE_OBJS= she_server_core.o base64.o

all: $(MCL_LIB) she_server_core

mcl:
	make -C ../../mcl USE_LLVM=0

clean:
	rm -rf ../bin/* ../src/*.o

.SUFFIXES: .cpp

.cpp.o:
	$(CXX) -c $< -o $@ $(CFLAGS) -fopenmp

she_server_core: $(SHE_OBJS) $(MCL_LIB)
	mkdir -p ../bin/
	$(CXX) $(SHE_OBJS) -o $@ $(LDFLAGS) -fopenmp
	mv she_server_core $(TOPDIR)../bin/
