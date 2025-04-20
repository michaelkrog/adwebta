import { Component, Prop, State, Watch, h } from '@stencil/core';

const SVGR_LOADER = `!!@svgr/webpack?-svgo,+titleProp,+ref!`;
const ICON_PATH = `../assets/icons/`;

@Component({
  tag: 'gtk-icon',
  shadow: true,
})
export class GtkIcon {
  @Prop() name: string;
  @Prop() className: string;
  @Prop() colored: boolean = false;

  @State() Element: any = 'div';

  @Watch('name')
  async loadIcon(newName: string) {
    if (!newName) {
      this.Element = () => <span>Invalid name: {newName}</span>;
      return;
    }

    try {
      const module = await import(
        /* webpackMode: "eager" */ `${SVGR_LOADER}${ICON_PATH}${newName}.svg`
      );
      this.Element = module.default;
    } catch (error) {
      this.Element = () => <span>Failed to load: {newName}</span>;
    }
  }

  componentWillLoad() {
    this.loadIcon(this.name);
  }

  render() {
    const { className, colored } = this;
    const Element = this.Element;

    return (
      <span class={{ Icon: true, [className]: !!className, colored }}>
        <Element />
      </span>
    );
  }
}
