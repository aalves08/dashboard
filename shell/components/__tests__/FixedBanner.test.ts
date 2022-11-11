import { shallowMount } from '@vue/test-utils';
import FixedBanner from '@shell/components/FixedBanner.vue';

const SETTING_NO_CONSENT = { value: '{"loginError":{"message":"","showMessage":"false"},"bannerHeader":{"background":" #EEEFF4","color":" #141419","textAlignment":"center","fontWeight":null,"fontStyle":null,"fontSize":"14px","textDecoration":null,"text":"SOME HEADER TEXT"},"bannerFooter":{"background":" #EEEFF4","color":" #141419","textAlignment":"center","fontWeight":null,"fontStyle":null,"fontSize":"14px","textDecoration":null,"text":"SOME FOOTER TEXT"},"bannerConsent":{"background":" #EEEFF4","color":" #141419","textAlignment":"center","fontWeight":null,"fontStyle":null,"fontSize":"14px","textDecoration":null,"text":null,"button":null},"showHeader":"true","showFooter":"true","showConsent":"false"}' };
const SETTING_WITH_CONSENT = { value: '{"loginError":{"message":"","showMessage":"false"},"bannerHeader":{"background":" #EEEFF4","color":" #141419","textAlignment":"center","fontWeight":null,"fontStyle":null,"fontSize":"14px","textDecoration":null,"text":"SOME HEADER TEXT"},"bannerFooter":{"background":" #EEEFF4","color":" #141419","textAlignment":"center","fontWeight":null,"fontStyle":null,"fontSize":"14px","textDecoration":null,"text":"SOME FOOTER TEXT"},"bannerConsent":{"background":" #EEEFF4","color":" #141419","textAlignment":"center","fontWeight":null,"fontStyle":null,"fontSize":"14px","textDecoration":null,"text":"SOME CONSENT TEXT" ,"button": "some-button-label"},"showHeader":"true","showFooter":"true","showConsent":"true"}' };

const parsedBannerStyle = {
  'background-color': ' #EEEFF4',
  color:              ' #141419',
  'font-size':        '14px',
  'font-style':       '',
  'font-weight':      '',
  'text-align':       'center',
  'text-decoration':  '',
};

const parsedBannerContent = {
  background:     ' #EEEFF4',
  color:          ' #141419',
  fontSize:       '14px',
  fontStyle:      null,
  fontWeight:     null,
  textAlignment:  'center',
  textDecoration: null,
};

describe('component: FixedBanner', () => {
  it('should render HEADER fixed banner correctly', async() => {
    const wrapper = shallowMount(FixedBanner, {
      propsData: { header: true },
      mocks:     { $store: { getters: { 'management/byId': jest.fn() } } }
    });

    await wrapper.vm.$nextTick();

    wrapper.setData({ bannerSetting: SETTING_NO_CONSENT });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.bannerStyle).toEqual(parsedBannerStyle);

    expect(wrapper.vm.banner).toEqual(expect.objectContaining(parsedBannerContent));
    expect(wrapper.vm.showHeader).toEqual(true);

    const bannerElem = wrapper.find('.banner');
    const noArrayTextElem = wrapper.find('.banner > p');

    expect(bannerElem.exists()).toBe(true);
    expect(bannerElem.classes()).not.toContain('banner-consent');
    expect(noArrayTextElem.exists()).toBe(true);
    expect(noArrayTextElem.text()).toBe('SOME HEADER TEXT');
  });

  it('should render FOOTER fixed banner, as text array (newline char), correctly', async() => {
    const wrapper = shallowMount(FixedBanner, {
      propsData: { footer: true },
      mocks:     { $store: { getters: { 'management/byId': jest.fn() } } }
    });

    await wrapper.vm.$nextTick();

    wrapper.setData({ bannerSetting: SETTING_NO_CONSENT });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.bannerStyle).toEqual(parsedBannerStyle);

    expect(wrapper.vm.banner).toEqual(expect.objectContaining(parsedBannerContent));
    expect(wrapper.vm.showFooter).toEqual(true);

    const bannerElem = wrapper.find('.banner');
    const noArrayTextElem = wrapper.find('.banner > p');

    expect(bannerElem.exists()).toBe(true);
    expect(bannerElem.classes()).not.toContain('banner-consent');
    expect(noArrayTextElem.exists()).toBe(true);
    expect(noArrayTextElem.text()).toBe('SOME FOOTER TEXT');
  });

  it('should render CONSENT as a DIALOG correctly', async() => {
    const wrapper = shallowMount(FixedBanner, {
      propsData: { consent: true },
      mocks:     { $store: { getters: { 'management/byId': jest.fn() } } }
    });

    await wrapper.vm.$nextTick();

    wrapper.setData({ bannerSetting: SETTING_WITH_CONSENT });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.bannerStyle).toEqual(parsedBannerStyle);

    expect(wrapper.vm.banner).toEqual(expect.objectContaining(parsedBannerContent));
    expect(wrapper.vm.showConsent).toEqual(true);

    const bannerElem = wrapper.find('.banner');
    const bannerDialogGlassElem = wrapper.find('.banner-dialog-glass');
    const bannerDialogElem = wrapper.find('.banner-dialog');
    const bannerDialogFrameElem = wrapper.find('.banner-dialog-frame');
    const buttonDialog = wrapper.find('.banner-dialog button');
    const noArrayTextElem = wrapper.find('.banner > p');

    expect(bannerElem.exists()).toBe(true);
    expect(bannerDialogGlassElem.exists()).toBe(true);
    expect(bannerDialogElem.exists()).toBe(true);
    expect(bannerDialogFrameElem.exists()).toBe(true);
    expect(buttonDialog.exists()).toBe(true);
    expect(noArrayTextElem.exists()).toBe(true);
    expect(noArrayTextElem.text()).toBe('SOME CONSENT TEXT');
  });

  it('clicking dialog button should hide dialog', async() => {
    const wrapper = shallowMount(FixedBanner, {
      propsData: { consent: true },
      mocks:     { $store: { getters: { 'management/byId': jest.fn() } } }
    });

    await wrapper.vm.$nextTick();

    wrapper.setData({ bannerSetting: SETTING_WITH_CONSENT });

    await wrapper.vm.$nextTick();

    const buttonDialog = wrapper.find('.banner-dialog button');
    const spy = jest.spyOn(wrapper.vm, 'hideDialog');

    expect(wrapper.vm.showDialog).toBe(true);

    buttonDialog.trigger('click');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.showDialog).toBe(false);
  });
});
