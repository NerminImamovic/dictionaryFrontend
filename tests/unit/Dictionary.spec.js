import { shallowMount } from '@vue/test-utils'
import Dictionary from '@/components/Dictionary.vue'

describe('Dictionary Implementation Test', () => {
  let wrapper = null;

  beforeEach(() => {
    // render the component
    wrapper = shallowMount(Dictionary);
  })

  // TEARDOWN - run after to each unit test
  afterEach(async () => {
    wrapper.destroy();
  })

  it('initializes with correct elements', () => {
    // check the name of the component
    expect(wrapper.name()).toMatch('dictionary');
  });

})
