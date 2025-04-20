import { Component, Prop, h, Host } from '@stencil/core';
import { Icon } from './icon';
import { Spinner } from './spinner';

@Component({
  tag: 'gtk-button',
  styleUrl: 'gtk-button.css',
  shadow: true,
})
export class GtkButton {
  @Prop() size: 'mini' | 'small' | 'medium' | 'large' | 'huge' | 'mega' = 'medium';
  @Prop() icon: string;
  @Prop() type: string = 'button';
  @Prop() loading: boolean;
  @Prop() circular: boolean;
  @Prop() flat: boolean;
  @Prop() link: boolean;
  @Prop() primary: boolean;
  @Prop() danger: boolean;
  @Prop() active: boolean;
  @Prop() hover: boolean;
  @Prop() text: boolean;
  @Prop() image: boolean;
  @Prop() disabled: boolean;

  render() {
    const isImageButton = this.image !== undefined ? this.image : !this.hasChildren();
    const classes = {
      'Button': true,
      [this.size]: true,
      'disabled': this.disabled || this.loading,
      'circular': this.circular,
      'flat': this.flat,
      'link': this.link,
      'active': this.active,
      'hover': this.hover,
      'text-button': this.text,
      'image-button': isImageButton,
      'suggested-action': this.primary,
      'destructive-action': this.danger,
    };

    return (
      <Host>
        <button
          class={classes}
          type={this.type}
          disabled={this.disabled || this.loading}
        >
          {this.loading && <Spinner />}
          {this.icon && 
            (typeof this.icon === 'string' 
              ? <Icon name={this.icon} colored class="Button__icon" /> 
              : this.icon)
          }
          <slot />
        </button>
      </Host>
    );
  }

  private hasChildren(): boolean {
    const slot = this.el.shadowRoot.querySelector('slot');
    return slot && slot.assignedNodes().length > 0;
  }

  private el: HTMLElement;

  componentDidLoad() {
    this.el = document.querySelector(`gtk-button[size="${this.size}"]`);
  }
}
