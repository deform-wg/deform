export async function customElementsReady (containerElement: Element): Promise<void> {
  // Get all element names within the containerElement (ie, the <form>)
  const elementNames = Array.from(containerElement.querySelectorAll('*'))
    .map(el => el.localName)
    .filter((value, index, self) => self.indexOf(value) === index)
    .filter(name => name.includes('-'));

  // Wait for all custom elements to be defined
  await Promise.allSettled(
    elementNames.map(name => customElements.whenDefined(name))
  );
}