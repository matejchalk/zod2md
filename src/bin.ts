#!/usr/bin/env node

import { zod2md } from '.';
import { runCLI } from './cli';

// eslint-disable-next-line unicorn/prefer-top-level-await
runCLI(zod2md).catch(console.error);
