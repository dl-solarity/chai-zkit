pragma circom 2.0.0;

template Matrix () {
    signal input a[3][3];
    signal input b[3][3];

    signal input c;

    signal unused <-- a[0][0] * b[0][0];

    signal output d[3][3];
    signal output e[3][3];
    signal output f;

    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            d[i][j] <== a[i][j] * b[i][j] + c;
            e[i][j] <== a[i][j] * b[i][j];
        }
    }

    f <== c;
}

component main { public [a] } = Matrix();
