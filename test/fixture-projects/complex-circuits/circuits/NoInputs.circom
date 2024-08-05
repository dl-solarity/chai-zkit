pragma circom 2.0.0;

template NoInputs () {
    signal output c;

    c <== 1337;
}

component main = NoInputs();
