import '../../../dist/shoelace.js';
import { aTimeout, expect, fixture, html, oneEvent, waitUntil } from '@open-wc/testing';
import { clickOnElement } from '../../internal/test.js';
import { runFormControlBaseTests } from '../../internal/test/form-control-base-tests.js';
import { sendKeys } from '@web/test-runner-commands';
import { serialize } from '../../utilities/form.js';
import sinon from 'sinon';
import type SlOption from '../option/option.js';
import type SlSelect from './select.js';

describe('<sl-select>', () => {
  describe('accessibility', () => {
    it('should pass accessibility tests when closed', async () => {
      const select = await fixture<SlSelect>(html`
        <sl-select label="Select one">
          <sl-option value="option-1">Option 1</sl-option>
          <sl-option value="option-2">Option 2</sl-option>
          <sl-option value="option-3">Option 3</sl-option>
        </sl-select>
      `);
      await expect(select).to.be.accessible();
    });

    it('should pass accessibility tests when open', async () => {
      const select = await fixture<SlSelect>(html`
        <sl-select label="Select one">
          <sl-option value="option-1">Option 1</sl-option>
          <sl-option value="option-2">Option 2</sl-option>
          <sl-option value="option-3">Option 3</sl-option>
        </sl-select>
      `);

      await select.show();

      await expect(select).to.be.accessible();
    });
  });

  it('should be disabled with the disabled attribute', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select disabled>
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2">Option 2</sl-option>
        <sl-option value="option-3">Option 3</sl-option>
      </sl-select>
    `);
    expect(el.displayInput.disabled).to.be.true;
  });

  it('should show a placeholder when no options are selected', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select placeholder="Select one">
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2">Option 2</sl-option>
        <sl-option value="option-3">Option 3</sl-option>
      </sl-select>
    `);
    const displayInput = el.shadowRoot!.querySelector<HTMLInputElement>('[part~="display-input"]')!;

    expect(getComputedStyle(displayInput).opacity).to.not.equal('0');
    expect(displayInput.placeholder).to.equal('Select one');
  });

  it('should show a placeholder when no options are selected and multiple is set', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select placeholder="Select a few" multiple>
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2">Option 2</sl-option>
        <sl-option value="option-3">Option 3</sl-option>
      </sl-select>
    `);
    const displayInput = el.shadowRoot!.querySelector<HTMLInputElement>('[part~="display-input"]')!;

    expect(getComputedStyle(displayInput).opacity).to.not.equal('0');
    expect(displayInput.placeholder).to.equal('Select a few');
  });

  it('should not allow selection when the option is disabled', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select value="option-1">
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2" disabled>Option 2</sl-option>
      </sl-select>
    `);
    const disabledOption = el.querySelector('sl-option[disabled]')!;

    await el.show();
    await clickOnElement(disabledOption);
    await el.updateComplete;

    expect(el.value).to.equal('option-1');
  });

  it('should focus the select when clicking on the label', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select label="Select One">
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2">Option 2</sl-option>
        <sl-option value="option-3">Option 3</sl-option>
      </sl-select>
    `);
    const label = el.shadowRoot!.querySelector('[part~="form-control-label"]')!;
    const submitHandler = sinon.spy();

    el.addEventListener('sl-focus', submitHandler);
    (label as HTMLLabelElement).click();
    await waitUntil(() => submitHandler.calledOnce);

    expect(submitHandler).to.have.been.calledOnce;
  });

  describe('when the value changes', () => {
    it('should emit sl-change when the value is changed with the mouse', async () => {
      const el = await fixture<SlSelect>(html`
        <sl-select value="option-1">
          <sl-option value="option-1">Option 1</sl-option>
          <sl-option value="option-2">Option 2</sl-option>
          <sl-option value="option-3">Option 3</sl-option>
        </sl-select>
      `);
      const secondOption = el.querySelectorAll<SlOption>('sl-option')[1];
      const changeHandler = sinon.spy();
      const inputHandler = sinon.spy();

      el.addEventListener('sl-change', changeHandler);
      el.addEventListener('sl-input', inputHandler);

      await el.show();
      await clickOnElement(secondOption);
      await el.updateComplete;

      expect(changeHandler).to.have.been.calledOnce;
      expect(inputHandler).to.have.been.calledOnce;
      expect(el.value).to.equal('option-2');
    });

    it('should emit sl-change and sl-input when the value is changed with the keyboard', async () => {
      const el = await fixture<SlSelect>(html`
        <sl-select value="option-1">
          <sl-option value="option-1">Option 1</sl-option>
          <sl-option value="option-2">Option 2</sl-option>
          <sl-option value="option-3">Option 3</sl-option>
        </sl-select>
      `);
      const changeHandler = sinon.spy();
      const inputHandler = sinon.spy();

      el.addEventListener('sl-change', changeHandler);
      el.addEventListener('sl-input', inputHandler);

      el.focus();
      await el.updateComplete;
      await sendKeys({ press: ' ' }); // open the dropdown
      await aTimeout(500); // wait for the dropdown to open
      await sendKeys({ press: 'ArrowDown' }); // move selection to the second option
      await el.updateComplete;
      await sendKeys({ press: 'ArrowDown' }); // move selection to the third option
      await el.updateComplete;
      el.focus(); // For some reason, the browser loses focus before we press enter. Refocus the select.
      await sendKeys({ press: 'Enter' }); // commit the selection
      await el.updateComplete;

      expect(changeHandler).to.have.been.calledOnce;
      expect(inputHandler).to.have.been.calledOnce;
      expect(el.value).to.equal('option-3');
    });

    it('should not emit sl-change or sl-input when the value is changed programmatically', async () => {
      const el = await fixture<SlSelect>(html`
        <sl-select value="option-1">
          <sl-option value="option-1">Option 1</sl-option>
          <sl-option value="option-2">Option 2</sl-option>
          <sl-option value="option-3">Option 3</sl-option>
        </sl-select>
      `);

      el.addEventListener('sl-change', () => expect.fail('sl-change should not be emitted'));
      el.addEventListener('sl-input', () => expect.fail('sl-input should not be emitted'));
      el.value = 'option-2';

      await el.updateComplete;
    });

    it('should emit sl-change and sl-input with the correct validation message when the value changes', async () => {
      const el = await fixture<SlSelect>(html`
        <sl-select required>
          <sl-option value="option-1">Option 1</sl-option>
          <sl-option value="option-2">Option 2</sl-option>
          <sl-option value="option-3">Option 3</sl-option>
        </sl-select>
      `);
      const option2 = el.querySelectorAll('sl-option')[1];
      const handler = sinon.spy((event: CustomEvent) => {
        if (el.validationMessage) {
          expect.fail(`Validation message should be empty when ${event.type} is emitted and a value is set`);
        }
      });

      el.addEventListener('sl-change', handler);
      el.addEventListener('sl-input', handler);

      await clickOnElement(el);
      await aTimeout(500);
      await clickOnElement(option2);
      await el.updateComplete;

      expect(handler).to.be.calledTwice;
    });

    // this can happen in on ms-edge autofilling an associated input element in the same form
    // https://github.com/shoelace-style/shoelace/issues/2117
    it('should not throw on incomplete events', async () => {
      const el = await fixture<SlSelect>(html`
        <sl-select required>
          <sl-option value="option-1">Option 1</sl-option>
        </sl-select>
      `);

      const event = new KeyboardEvent('keydown');
      Object.defineProperty(event, 'target', { writable: false, value: el });
      Object.defineProperty(event, 'key', { writable: false, value: undefined });

      /**
       * If Edge does autofill, it creates a broken KeyboardEvent
       * which is missing the key value.
       * Using the normal dispatch mechanism does not allow to do this
       * Thus passing the event directly to the private method for testing
       *
       * @ts-expect-error */
      el.handleDocumentKeyDown(event);
    });
  });

  it('should open the listbox when any letter key is pressed with sl-select is on focus', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select>
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2">Option 2</sl-option>
        <sl-option value="option-3">Option 3</sl-option>
      </sl-select>
    `);
    const displayInput = el.shadowRoot!.querySelector<HTMLSelectElement>('.select__display-input')!;

    el.focus();
    await sendKeys({ press: 'r' });
    await el.updateComplete;

    expect(displayInput.getAttribute('aria-expanded')).to.equal('true');
  });

  it('should not open the listbox when ctrl + R is pressed with sl-select is on focus', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select>
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2">Option 2</sl-option>
        <sl-option value="option-3">Option 3</sl-option>
      </sl-select>
    `);
    const displayInput = el.shadowRoot!.querySelector<HTMLSelectElement>('.select__display-input')!;

    el.focus();
    await sendKeys({ down: 'Control' });
    await sendKeys({ press: 'r' });
    await sendKeys({ up: 'Control' });
    await el.updateComplete;
    expect(displayInput.getAttribute('aria-expanded')).to.equal('false');
  });

  describe('when using constraint validation', () => {
    it('should be valid by default', async () => {
      const el = await fixture<HTMLFormElement>(html`
        <form>
          <sl-select>
            <sl-option value="option-1">Option 1</sl-option>
            <sl-option value="option-2">Option 2</sl-option>
            <sl-option value="option-3">Option 3</sl-option>
          </sl-select>
        </form>
      `);
      const select = el.querySelector<SlSelect>('sl-select')!;
      expect(select.checkValidity()).to.be.true;
    });

    it('should be invalid when required and empty', async () => {
      const el = await fixture<HTMLFormElement>(html`
        <form>
          <sl-select required>
            <sl-option value="option-1">Option 1</sl-option>
            <sl-option value="option-2">Option 2</sl-option>
            <sl-option value="option-3">Option 3</sl-option>
          </sl-select>
        </form>
      `);
      const select = el.querySelector<SlSelect>('sl-select')!;
      expect(select.checkValidity()).to.be.false;
    });

    it('should focus on the displayInput when constraint validation occurs', async () => {
      const el = await fixture<HTMLFormElement>(html`
        <form>
          <sl-select required>
            <sl-option value="option-1">Option 1</sl-option>
            <sl-option value="option-2">Option 2</sl-option>
            <sl-option value="option-3">Option 3</sl-option>
          </sl-select>
        </form>
      `);
      const select = el.querySelector<SlSelect>('sl-select')!;
      el.requestSubmit();
      expect(select.shadowRoot!.activeElement).to.equal(select.displayInput);
    });

    it('should receive the correct validation attributes ("states") when valid', async () => {
      const el = await fixture<SlSelect>(html`
        <sl-select label="Select one" required value="option-1">
          <sl-option value="option-1">Option 1</sl-option>
          <sl-option value="option-2">Option 2</sl-option>
          <sl-option value="option-3">Option 3</sl-option>
        </sl-select>
      `);
      const secondOption = el.querySelectorAll('sl-option')[1]!;

      expect(el.checkValidity()).to.be.true;
      expect(el.hasAttribute('data-required')).to.be.true;
      expect(el.hasAttribute('data-optional')).to.be.false;
      expect(el.hasAttribute('data-invalid')).to.be.false;
      expect(el.hasAttribute('data-valid')).to.be.true;
      expect(el.hasAttribute('data-user-invalid')).to.be.false;
      expect(el.hasAttribute('data-user-valid')).to.be.false;

      await el.show();
      await clickOnElement(secondOption);
      await el.updateComplete;
      el.blur();
      await el.updateComplete;

      expect(el.checkValidity()).to.be.true;
      expect(el.hasAttribute('data-user-invalid')).to.be.false;
      expect(el.hasAttribute('data-user-valid')).to.be.true;
    });

    it('should receive the correct validation attributes ("states") when invalid', async () => {
      const el = await fixture<SlSelect>(html`
        <sl-select label="Select one" required>
          <sl-option value="option-1">Option 1</sl-option>
          <sl-option value="option-2">Option 2</sl-option>
          <sl-option value="option-3">Option 3</sl-option>
        </sl-select>
      `);
      const secondOption = el.querySelectorAll('sl-option')[1]!;

      expect(el.hasAttribute('data-required')).to.be.true;
      expect(el.hasAttribute('data-optional')).to.be.false;
      expect(el.hasAttribute('data-invalid')).to.be.true;
      expect(el.hasAttribute('data-valid')).to.be.false;
      expect(el.hasAttribute('data-user-invalid')).to.be.false;
      expect(el.hasAttribute('data-user-valid')).to.be.false;

      await el.show();
      await clickOnElement(secondOption);
      el.value = '';
      await el.updateComplete;
      el.blur();
      await el.updateComplete;

      expect(el.hasAttribute('data-user-invalid')).to.be.true;
      expect(el.hasAttribute('data-user-valid')).to.be.false;
    });

    it('should receive validation attributes ("states") even when novalidate is used on the parent form', async () => {
      const el = await fixture<HTMLFormElement>(html`
        <form novalidate>
          <sl-select required>
            <sl-option value="option-1">Option 1</sl-option>
            <sl-option value="option-2">Option 2</sl-option>
            <sl-option value="option-3">Option 3</sl-option>
          </sl-select>
        </form>
      `);
      const select = el.querySelector<SlSelect>('sl-select')!;

      expect(select.hasAttribute('data-required')).to.be.true;
      expect(select.hasAttribute('data-optional')).to.be.false;
      expect(select.hasAttribute('data-invalid')).to.be.true;
      expect(select.hasAttribute('data-valid')).to.be.false;
      expect(select.hasAttribute('data-user-invalid')).to.be.false;
      expect(select.hasAttribute('data-user-valid')).to.be.false;
    });
  });

  describe('when submitting a form', () => {
    it('should serialize its name and value with FormData', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <sl-select name="a" value="option-1">
            <sl-option value="option-1">Option 1</sl-option>
            <sl-option value="option-2">Option 2</sl-option>
            <sl-option value="option-3">Option 3</sl-option>
          </sl-select>
        </form>
      `);
      const formData = new FormData(form);
      expect(formData.get('a')).to.equal('option-1');
    });

    it('should serialize its name and value in FormData when multiple options are selected', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <sl-select name="a" value="option-2 option-3" multiple>
            <sl-option value="option-1">Option 1</sl-option>
            <sl-option value="option-2">Option 2</sl-option>
            <sl-option value="option-3">Option 3</sl-option>
          </sl-select>
        </form>
      `);
      const formData = new FormData(form);
      expect(formData.getAll('a')).to.include('option-2');
      expect(formData.getAll('a')).to.include('option-3');
    });

    it('should serialize its name and value in JSON', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <sl-select name="a" value="option-1">
            <sl-option value="option-1">Option 1</sl-option>
            <sl-option value="option-2">Option 2</sl-option>
            <sl-option value="option-3">Option 3</sl-option>
          </sl-select>
        </form>
      `);
      const json = serialize(form);
      expect(json.a).to.equal('option-1');
    });

    it('should serialize its name and value in JSON when multiple options are selected', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <sl-select name="a" value="option-2 option-3" multiple>
            <sl-option value="option-1">Option 1</sl-option>
            <sl-option value="option-2">Option 2</sl-option>
            <sl-option value="option-3">Option 3</sl-option>
          </sl-select>
        </form>
      `);
      const json = serialize(form);
      expect(JSON.stringify(json)).to.equal(JSON.stringify({ a: ['option-2', 'option-3'] }));
    });

    it('should be present in form data when using the form attribute and located outside of a <form>', async () => {
      const el = await fixture<HTMLFormElement>(html`
        <div>
          <form id="f">
            <sl-button type="submit">Submit</sl-button>
          </form>
          <sl-select form="f" name="a" value="option-1">
            <sl-option value="option-1">Option 1</sl-option>
            <sl-option value="option-2">Option 2</sl-option>
            <sl-option value="option-3">Option 3</sl-option>
          </sl-select>
        </div>
      `);
      const form = el.querySelector('form')!;
      const formData = new FormData(form);

      expect(formData.get('a')).to.equal('option-1');
    });
  });

  describe('when resetting a form', () => {
    it('should reset the element to its initial value', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <sl-select value="option-1">
            <sl-option value="option-1">Option 1</sl-option>
            <sl-option value="option-2">Option 2</sl-option>
            <sl-option value="option-3">Option 3</sl-option>
          </sl-select>
          <sl-button type="reset">Reset</sl-button>
        </form>
      `);
      const resetButton = form.querySelector('sl-button')!;
      const select = form.querySelector('sl-select')!;

      select.value = 'option-3';
      await select.updateComplete;
      expect(select.value).to.equal('option-3');

      setTimeout(() => resetButton.click());
      await oneEvent(form, 'reset');
      await select.updateComplete;
      expect(select.value).to.equal('option-1');
    });
  });

  it('should update the display label when an option changes', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select value="option-1">
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2">Option 2</sl-option>
        <sl-option value="option-3">Option 3</sl-option>
      </sl-select>
    `);
    const displayInput = el.shadowRoot!.querySelector<HTMLSelectElement>('.select__display-input')!;
    const option = el.querySelector('sl-option')!;

    expect(displayInput.value).to.equal('Option 1');

    option.textContent = 'updated';

    await aTimeout(250);
    await option.updateComplete;
    await el.updateComplete;

    expect(displayInput.value).to.equal('updated');
  });

  it('should emit sl-focus and sl-blur when receiving and losing focus', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select value="option-1">
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2">Option 2</sl-option>
        <sl-option value="option-3">Option 3</sl-option>
      </sl-select>
    `);
    const focusHandler = sinon.spy();
    const blurHandler = sinon.spy();

    el.addEventListener('sl-focus', focusHandler);
    el.addEventListener('sl-blur', blurHandler);

    el.focus();
    await el.updateComplete;
    el.blur();
    await el.updateComplete;

    expect(focusHandler).to.have.been.calledOnce;
    expect(blurHandler).to.have.been.calledOnce;
  });

  it('should emit sl-clear when the clear button is clicked', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select value="option-1" clearable>
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2">Option 2</sl-option>
        <sl-option value="option-3">Option 3</sl-option>
      </sl-select>
    `);
    const clearHandler = sinon.spy();
    const clearButton = el.shadowRoot!.querySelector('[part~="clear-button"]')!;

    el.addEventListener('sl-clear', clearHandler);
    await el.show();
    await clickOnElement(clearButton);
    await el.updateComplete;

    expect(clearHandler).to.have.been.calledOnce;
  });

  it('should emit sl-change and sl-input when a tag is removed', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select value="option-1 option-2 option-3" multiple>
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2">Option 2</sl-option>
        <sl-option value="option-3">Option 3</sl-option>
      </sl-select>
    `);
    const changeHandler = sinon.spy();
    const inputHandler = sinon.spy();
    const tag = el.shadowRoot!.querySelector('[part~="tag"]')!;
    const removeButton = tag.shadowRoot!.querySelector('[part~="remove-button"]')!;

    el.addEventListener('sl-change', changeHandler);
    el.addEventListener('sl-input', inputHandler);

    await clickOnElement(removeButton);
    await el.updateComplete;

    expect(changeHandler).to.have.been.calledOnce;
    expect(inputHandler).to.have.been.calledOnce;
  });

  it('should emit sl-show, sl-after-show, sl-hide, and sl-after-hide events when the listbox opens and closes', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select value="option-1">
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2">Option 2</sl-option>
        <sl-option value="option-3">Option 3</sl-option>
      </sl-select>
    `);
    const showHandler = sinon.spy();
    const afterShowHandler = sinon.spy();
    const hideHandler = sinon.spy();
    const afterHideHandler = sinon.spy();

    el.addEventListener('sl-show', showHandler);
    el.addEventListener('sl-after-show', afterShowHandler);
    el.addEventListener('sl-hide', hideHandler);
    el.addEventListener('sl-after-hide', afterHideHandler);

    await el.show();
    expect(showHandler).to.have.been.calledOnce;
    expect(afterShowHandler).to.have.been.calledOnce;

    await el.hide();
    expect(hideHandler).to.have.been.calledOnce;
    expect(afterHideHandler).to.have.been.calledOnce;
  });

  it('should have rounded tags when using the pill attribute', async () => {
    const el = await fixture<SlSelect>(html`
      <sl-select value="option-1 option-2" multiple pill>
        <sl-option value="option-1">Option 1</sl-option>
        <sl-option value="option-2">Option 2</sl-option>
        <sl-option value="option-3">Option 3</sl-option>
      </sl-select>
    `);
    const tag = el.shadowRoot!.querySelector('[part~="tag"]')!;

    expect(tag.hasAttribute('pill')).to.be.true;
  });
  describe('With lazily loaded options', () => {
    describe('With no existing options', () => {
      it('Should wait to select the option when the option exists for single select', async () => {
        const form = await fixture<HTMLFormElement>(
          html`<form><sl-select name="select" value="option-1"></sl-select></form>`
        );
        const el = form.querySelector<SlSelect>('sl-select')!;

        await aTimeout(10);
        expect(el.value).to.equal('');
        expect(new FormData(form).get('select')).equal('');

        const option = document.createElement('sl-option');
        option.value = 'option-1';
        option.innerText = 'Option 1';
        el.append(option);

        await aTimeout(10);
        await el.updateComplete;
        expect(el.value).to.equal('option-1');
        expect(new FormData(form).get('select')).equal('option-1');
      });

      it('Should wait to select the option when the option exists for multiple select', async () => {
        const form = await fixture<HTMLFormElement>(
          html`<form><sl-select name="select" value="option-1" multiple></sl-select></form>`
        );

        const el = form.querySelector<SlSelect>('sl-select')!;
        expect(Array.isArray(el.value)).to.equal(true);
        expect(el.value.length).to.equal(0);

        const option = document.createElement('sl-option');
        option.value = 'option-1';
        option.innerText = 'Option 1';
        el.append(option);

        await aTimeout(10);
        await el.updateComplete;
        expect(el.value.length).to.equal(1);
        expect(el.value).to.have.members(['option-1']);
        expect(new FormData(form).getAll('select')).have.members(['option-1']);
      });
    });

    describe('With existing options', () => {
      it('Should not select the option if options already exist for single select', async () => {
        const form = await fixture<HTMLFormElement>(
          html` <form>
            <sl-select name="select" value="foo">
              <sl-option value="bar">Bar</sl-option>
              <sl-option value="baz">Baz</sl-option>
            </sl-select>
          </form>`
        );

        const el = form.querySelector<SlSelect>('sl-select')!;
        expect(el.value).to.equal('');
        expect(new FormData(form).get('select')).to.equal('');

        const option = document.createElement('sl-option');
        option.value = 'foo';
        option.innerText = 'Foo';
        el.append(option);

        await aTimeout(10);
        await el.updateComplete;
        expect(el.value).to.equal('foo');
        expect(new FormData(form).get('select')).to.equal('foo');
      });

      it('Should not select the option if options already exists for multiple select', async () => {
        const form = await fixture<HTMLFormElement>(
          html` <form>
            <sl-select name="select" value="foo" multiple>
              <sl-option value="bar">Bar</sl-option>
              <sl-option value="baz">Baz</sl-option>
            </sl-select>
          </form>`
        );

        const el = form.querySelector<SlSelect>('sl-select')!;
        expect(el.value).to.be.an('array');
        expect(el.value.length).to.equal(0);

        const option = document.createElement('sl-option');
        option.value = 'foo';
        option.innerText = 'Foo';
        el.append(option);

        await aTimeout(10);
        await el.updateComplete;
        expect(el.value).to.have.members(['foo']);
        expect(new FormData(form).getAll('select')).to.have.members(['foo']);
      });

      it('Should only select the existing options if options already exists for multiple select', async () => {
        const form = await fixture<HTMLFormElement>(
          html` <form>
            <sl-select name="select" value="foo bar baz" multiple>
              <sl-option value="bar">Bar</sl-option>
              <sl-option value="baz">Baz</sl-option>
            </sl-select>
          </form>`
        );

        const el = form.querySelector<SlSelect>('sl-select')!;
        expect(el.value).to.have.members(['bar', 'baz']);
        expect(el.value.length).to.equal(2);
        expect(new FormData(form).getAll('select')).to.have.members(['bar', 'baz']);

        const option = document.createElement('sl-option');
        option.value = 'foo';
        option.innerText = 'Foo';
        el.append(option);

        await aTimeout(10);
        await el.updateComplete;
        expect(el.value).to.have.members(['foo', 'bar', 'baz']);
        expect(new FormData(form).getAll('select')).to.have.members(['foo', 'bar', 'baz']);
      });
    });

    /**
     * @see {https://github.com/shoelace-style/shoelace/issues/2254}
     */
    it('Should account for if `value` changed before connecting', async () => {
      const select = await fixture<SlSelect>(html`
        <sl-select label="Search By" multiple clearable .value=${['foo', 'bar']}>
          <sl-option value="foo">Foo</sl-option>
          <sl-option value="bar">Bar</sl-option>
        </sl-select>
      `);

      // just for safe measure.
      await aTimeout(10);

      expect(select.value).to.deep.equal(['foo', 'bar']);
    });

    /**
     * @see {https://github.com/shoelace-style/shoelace/issues/2254}
     */
    it('Should still work if using the value attribute', async () => {
      const select = await fixture<SlSelect>(html`
        <sl-select label="Search By" multiple clearable value="foo bar">
          <sl-option value="foo">Foo</sl-option>
          <sl-option value="bar">Bar</sl-option>
        </sl-select>
      `);

      // just for safe measure.
      await aTimeout(10);

      expect(select.value).to.deep.equal(['foo', 'bar']);

      await clickOnElement(select);
      await select.updateComplete;
      await clickOnElement(select.querySelector("[value='foo']")!);

      await select.updateComplete;
      await aTimeout(10);
      expect(select.value).to.deep.equal(['bar']);

      select.setAttribute('value', 'foo bar');
      await aTimeout(10);
      expect(select.value).to.deep.equal(['foo', 'bar']);
    });
  });

  runFormControlBaseTests('sl-select');
});
