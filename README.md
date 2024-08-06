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

```js
require("@solarity/chai-zkit");
```

Or if you are using TypeScript:

```ts
import "@solarity/chai-zkit";
```

## Usage

> [!IMPORTANT]
> The package is meant to be used together with [hardhat-zkit](https://github.com/dl-solarity/hardhat-zkit) plugin that provides circuits objects to be tested with chai assertions.

After installing the package, you may use the following assertions:

```ts
const matrix = await zkit.getCircuit("Matrix");

// strict assertion, all the outputs must be present
await expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputsStrict({ d, e, f });

// partial output assertion
await expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputs({ d });

// provided output `e` doesn't match the obtained one
await expect(expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputs({ e })).to.be.rejectedWith(
  `Expected output "e" to be "[[2,5,0],[17,26,0],[0,0,0]]", but got "[[1,4,0],[16,25,0],[0,0,0]]"`,
);

// `not` negation used, provided output `d` matches the obtained one
await expect(
  expect(matrix).with.witnessInputs({ a, b, c }).to.not.have.witnessOutputs({ d }),
).to.be.rejectedWith(`Expected output "d" NOT to be "[[2,5,0],[17,26,0],[0,0,0]]", but it is"`);
```

## Known limitations

- Temporarily, only the witness `input <> output` signals testing is supported.
