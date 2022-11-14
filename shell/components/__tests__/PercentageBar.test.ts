import { shallowMount, Wrapper } from '@vue/test-utils';
import PercentageBar, { PreferredDirection } from '../PercentageBar.vue';
import Bar from '../graph/Bar.vue';

const colorStops = {
  0: '--success', 30: '--warning', 70: '--error'
};

describe('component: PercentageBar', () => {
  it('should render component with the correct data applied', () => {
    const wrapper: Wrapper<InstanceType<typeof PercentageBar> & { [key: string]: any }> = shallowMount(PercentageBar, {
      propsData: {
        value:              25,
        preferredDirection: PreferredDirection.MORE,
        showPercentage:     true,
        colorStops
      }
    });

    const container = wrapper.find('.percentage-bar');
    const barComponent = wrapper.findComponent(Bar);
    const val = wrapper.find('.percentage-value');

    expect(container.exists()).toBe(true);
    expect(barComponent.exists()).toBe(true);
    expect(val.exists()).toBe(true);
    expect(val.text()).toBe('25%');
    expect(wrapper.vm.primaryColor).toBe('--warning');
  });
});
