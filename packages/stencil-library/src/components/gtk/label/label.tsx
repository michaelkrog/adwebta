import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'gtk-label',
  shadow: false,
})
export class GtkLabel {
  @Prop() size: 'mini' | 'small' | 'medium' | 'large' | 'huge' | 'mega';
  @Prop() align: string;
  @Prop() fill: boolean | string;
  @Prop() ellipsis: boolean;
  @Prop() title: string;
  @Prop() disabled: boolean;
  @Prop() muted: boolean;
  @Prop() info: boolean;
  @Prop() success: boolean;
  @Prop() warning: boolean;
  @Prop() danger: boolean;
  @Prop() italic: boolean;
  @Prop() bold: boolean;
  @Prop() noSelect: boolean;
  @Prop() htmlFor: string;

  render() {
    const Tag = this.htmlFor ? 'label' : 'span';

    const classes = {
      'Label': true,
      [this.size]: !!this.size,
      [`align-${this.align}`]: !!this.align,
      'fill': this.fill === true,
      [`fill-${this.fill}`]: typeof this.fill === 'string',
      'ellipsis': this.ellipsis,
      'disabled': this.disabled,
      'info': this.info,
      'success': this.success,
      'warning': this.warning,
      'danger': this.danger,
      'text-muted': this.muted,
      'text-italic': this.italic,
      'text-bold': this.bold,
      'user-select-none': this.noSelect,
    };

    return (
      <Host>
        <Tag 
          class={classes}
          title={this.title}
          htmlFor={this.htmlFor}
        >
          <slot />
        </Tag>
      </Host>
    );
  }
}
