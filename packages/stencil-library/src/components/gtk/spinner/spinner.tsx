import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'gtk-spinner',
  shadow: true,
})
export class GtkSpinner {
  @Prop() hidden: boolean = false;
  @Prop() disabled: boolean = false;

  render() {
    const { hidden, disabled } = this;

    return (
      <gtk-icon
        class={{ Spinner: true, hidden: hidden, disabled: disabled }}
        name="process-working"
      ></gtk-icon>
    );
  }
}