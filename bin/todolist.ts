#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TodoListStack } from '../lib/todo-list-stack';

const app = new cdk.App();
new TodoListStack(app, 'TodoListStack');
