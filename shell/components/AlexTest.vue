
<script>
import LabeledInput from '@components/Form/LabeledInput/LabeledInput.vue';
import { Form, Field, ErrorMessage } from 'vee-validate';

export default {
  components: {
    LabeledInput,
    Form,
    Field,
    ErrorMessage
  },
  data() {
    return {
      val1: '',
      val2: '',
      val3: '',
    };
  },
  methods: {
    onSubmit(values) {
      console.log(JSON.stringify(values, null, 2));
    },
    validateEmail(value) {
      // if the field is empty
      if (!value) {
        return 'This field is required';
      }
      // if the field is not a valid email
      const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

      if (!regex.test(value)) {
        return 'This field must be a valid email';
      }

      // All is good
      return true;
    },
  },
};
</script>

<template>
  <div>
    <h1>Hello world - hello@example.com</h1>
    <Form @submit="onSubmit">
      <!-- THIS DOESN'T WORK!!!
      <Field>
        <input
          name="email"
          type="email"
        >
      </Field> -->
      <LabeledInput
        v-model:value="val1"
        label="bananas"
        tooltip="some-tooltip"
        :veerules="(value) => value && value.trim() ? true : 'This is required'"
        placeholder="Keep it empty and blur this field"
      />
      <LabeledInput
        v-model:value="val2"
        label="bananas-autogrow"
        tooltip="some-tooltip2"
        type="multiline"
        :veerules="(value) => value && value.trim() ? true : 'This is required'"
        placeholder="Keep it empty and blur this field2"
      />
      <LabeledInput
        v-model:value="val3"
        label="bananas-number"
        tooltip="some-tooltip3"
        type="number"
        :veerules="(value) => value ? true : 'This is required'"
        placeholder="Keep it empty and blur this field3"
      />
      <Field
        name="email"
        type="email"
        :rules="validateEmail"
      />
      <ErrorMessage name="email" />
      <button>Sign up for newsletter</button>
    </Form>
  </div>
</template>

<style lang="scss" scoped>

</style>
