#!/usr/bin/env node

import { zod2md } from '.';
import { runCLI } from './cli';

runCLI(zod2md).catch(console.error);
