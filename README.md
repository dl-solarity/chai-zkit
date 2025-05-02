[![npm](https://img.shields.io/npm/v/@solarity/chai-zkit.svg)](https://www.npmjs.com/package/@solarity/chai-zkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Chai-zkit - Chai matchers for Circom

**A user-friendly Circom Chai matchers for testing witnesses and ZK proofs**

- Write convenient circuits tests via [Chai](https://www.chaijs.com/) assertions extension.
- Enjoy full TypeScript typization of input and output signals.
- Integrate smoothly with [hardhat-zkit](https://github.com/dl-solarity/hardhat-zkit).

## Installation

To install the package, run:

```bash
npm install --save-dev @solarity/chai-zkit
```

And add the following line to your `hardhat.config`:

```ts
import "@solarity/chai-zkit";
```

Or if you are using JavaScript:

```js
require("@solarity/chai-zkit");
```

## Usage

> [!IMPORTANT]
> The package is meant to be used together with [hardhat-zkit](https://github.com/dl-solarity/hardhat-zkit) plugin that provides circuits objects to be tested with chai assertions.

After installing the package, you may use the following assertions:

### Witness testing

```ts
const matrix = await zkit.getCircuit("Matrix");

// partial output assertion
await expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputs({ d });

// strict assertion, all the outputs must be present
await expect(matrix).with.witnessInputs({ a, b, c }).to.have.strict.witnessOutputs({ d, e, f });

// provided output `e` doesn't match the obtained one
await expect(expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputs({ e })).to.be.rejectedWith(
  `Expected output "e" to be "[[2,5,0],[17,26,0],[0,0,0]]", but got "[[1,4,0],[16,25,0],[0,0,0]]"`,
);

// witness overrides intentionally break constraints to test failure case
await expect(expect(matrix).with.witnessInputs({ a, b, c }, { "main.a": 10n }).to.passConstraints()).to.be.rejectedWith(
  "Expected witness to pass constraints, but it doesn't",
);
```

### Proof testing

```ts
const matrix = await zkit.getCircuit("Matrix");

// proof generation assertion
await expect(matrix).to.generateProof({ a, b, c });
await expect(matrix).to.not.generateProof({ b, c, d });

const proof = await matrix.generateProof({ a, b, c });
const invalidProof = await matrix.generateProof({ a, b, c }, { "main.a": 10n });

// proof verification assertion
await expect(matrix).to.verifyProof(proof);
await expect(matrix).to.not.verifyProof(invalidProof);

// use generated solidity verifier to verify the proof
await expect(matrix).to.useSolidityVerifier(matrixVerifier).and.verifyProof(proof);
```

### Constraints testing

```ts
const matrix = await zkit.getCircuit("Matrix");

// constraints > 6
await expect(matrix).to.have.constraints.gt(6);
await expect(matrix).to.have.constraints.greaterThan(6);

// constraints < 10
await expect(matrix).to.have.constraints.lt(10);
await expect(matrix).to.have.constraints.lessThan(10);
```

## Known limitations

- Do not use `not` chai negation prior `witnessInputs` call, this will break the typization.
