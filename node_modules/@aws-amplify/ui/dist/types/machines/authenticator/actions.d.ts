import type { MachineOptions } from 'xstate';
import type { AuthEvent, AuthActorContext } from './types';
declare const ACTIONS: MachineOptions<AuthActorContext, AuthEvent>['actions'];
export default ACTIONS;
