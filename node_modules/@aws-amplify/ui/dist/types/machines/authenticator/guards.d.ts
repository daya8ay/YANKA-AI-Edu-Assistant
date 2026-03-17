import type { MachineOptions } from 'xstate';
import type { AuthActorContext, AuthEvent } from './types';
declare const GUARDS: MachineOptions<AuthActorContext, AuthEvent>['guards'];
export default GUARDS;
