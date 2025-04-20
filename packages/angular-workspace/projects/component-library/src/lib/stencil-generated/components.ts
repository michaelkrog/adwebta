/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from 'stencil-library/components';

import { defineCustomElement as defineGtkLabel } from 'stencil-library/components/gtk-label.js';
@ProxyCmp({
  defineCustomElementFn: defineGtkLabel,
  inputs: ['first', 'last', 'middle']
})
@Component({
  selector: 'gtk-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['first', 'last', 'middle'],
  standalone: true
})
export class GtkLabel {
  protected el: HTMLGtkLabelElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface GtkLabel extends Components.GtkLabel {}


