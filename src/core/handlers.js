import {
  emitChangeEvent,
  emitTabChangeEvent,
  emitDiscardEvent
} from './events.js';

export function _handleInput(event) {
  const { currentKey, originalKey } = this.propKeys(event.target.name);

  const fieldName = event.target.name;
  const originalValue = this[originalKey];
  const priorValue = this[currentKey];
  const newValue = event.target.value

  this[currentKey] = newValue;
  this._checkForChanges(fieldName, newValue);

  const changePayload = { 
    fieldName,
    originalValue,
    priorValue,
    newValue,
    timestamp: Date.now(),
    deForm: this
  }
  
  emitChangeEvent(changePayload);
  onChangeCallback(changePayload)
}

export function _handleToggle(event) {
  const { currentKey, originalKey } = this.propKeys(event.target.name);

  const fieldName = event.target.name;
  const originalValue = this[originalKey];
  const priorValue = this[currentKey];
  const newValue = event.target.checked

  this[currentKey] = newValue;
  this._checkForChanges(fieldName, newValue);
  
  const changePayload = { 
    fieldName,
    originalValue,
    priorValue,
    newValue,
    deForm: this
  }
  
  emitChangeEvent(changePayload);
  onChangeCallback(changePayload)
}

export function _handleChoice(event) {
  const { currentKey, originalKey } = this.propKeys(event.target.name);

  const fieldName = event.target.name;
  const originalValue = this[originalKey];
  const priorValue = this[currentKey];
  const newValue = event.target.value

  this[currentKey] = newValue;
  this._checkForChanges(fieldName, newValue);
  
  const changePayload = { 
    fieldName,
    originalValue,
    priorValue,
    newValue,
    deForm: this
  }
  
  emitChangeEvent(changePayload);
  onChangeCallback(changePayload)
}

export function _handleRating(event) {
  const { currentKey, originalKey } = this.propKeys(event.target.dataset.name);
  
  const fieldName = event.target.dataset.name;
  const originalValue = this[originalKey];
  const priorValue = this[currentKey];
  const newValue = event.target.value

  this[currentKey] = newValue;
  this._checkForChanges(fieldName, newValue);

  const changePayload = { 
    fieldName,
    originalValue,
    priorValue,
    newValue,
    deForm: this
  }
  
  emitChangeEvent(changePayload);
  onChangeCallback(changePayload)
}

export function _handleTabChange(event, tabName) {
  this._activeFormId = tabName;
  
  emitTabChangeEvent({
    priorTabName: 'todo..',
    newTabName: tabName,
    deForm: this
  })

}

export function _handleDiscardChanges(event) {
  event.preventDefault();

  // Reset fields of active form to initial data state
  const modifiedFieldNodes = this.shadowRoot.querySelectorAll(
    `#${this._activeFormId} [data-dirty-field]`,
  );
  Array.from(modifiedFieldNodes)
    .map((node) => node.name)
    .forEach((fieldName) => {
      const { currentKey, originalKey } = this.propKeys(fieldName);
      this[currentKey] = this[originalKey];
    });

  this._checkForChanges();
  emitDiscardEvent({
    deForm: this
  })
}

function onChangeCallback(options) {
  const { 
    fieldName,
    originalValue,
    priorValue,
    newValue,
    timestamp,
    deForm,
  } = options

  if (deForm.onChange && typeof deForm.onChange === 'function') {
    try {
      deForm.onChange({
        fieldName,
        originalValue,
        priorValue,
        newValue,
        timestamp
      }, deForm)
    } catch (onChangeErr) {
      console.error('An error occured when executing the provided onChange function', onChangeErr)
    }
  }
}
