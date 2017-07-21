import AbstractTransitionComponent from './AbstractTransitionComponent';
import ComponentType from '../enum/ComponentType';
import FlowType from '../enum/FlowType';
import FlowManager from '../util/FlowManager';
import { findIndex } from 'lodash';
import { COMPONENT_ID } from '../mixin/AbstractRegistrableComponent';

export default {
	name: 'AbstractPageTransitionComponent',
	extends: AbstractTransitionComponent,
	beforeCreate() {
		this.componentType = ComponentType.PAGE_COMPONENT;
		this.flow = FlowType.NORMAL;
	},
	/**
	 * @description Before the route is entered we trigger the transition in
	 * @param to
	 * @param from
	 * @param next
	 */
	beforeRouteEnter(to, from, next) {
		next((vm) => {
			if (vm.$parent && vm.$parent.allComponentsReady) {
				vm.$parent.allComponentsReady.then(() => vm.transitionIn());
			} else {
				vm.transitionIn();
			}
		});
	},
	/**
	 * @description This method is triggered when we navigate to a sub-page of the current existing page
	 * @param to
	 * @param from
	 * @param next
	 */
	beforeRouteUpdate(to, from, next) {
		// Find the old reference and remove it
		if (to.name === this.componentId) {
			const index = findIndex(this.registeredComponents, component => component[COMPONENT_ID] === from.name);
			if (index > -1) {
				this.registeredComponents.splice(index);
			}
		}
		// Release the before update hook
		next();
	},
	/**
	 * @description This method handles the default page switches
	 * @param to
	 * @param from
	 * @param next
	 */
	beforeRouteLeave(to, from, next) {
		FlowManager.start(this, next);
	},
};
