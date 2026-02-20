class AppBox extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (this.__initialized) return;
    this.__initialized = true;

    if (!this.hasAttribute('role')) this.setAttribute('role', 'region');

    // Determine title: prefer `title` attribute, otherwise existing .title child
    let titleContent = this.getAttribute('title') || '';
    const existingTitle = this.querySelector('.title');
    if (existingTitle) {
      titleContent = existingTitle.innerHTML;
      existingTitle.remove();
    }

    // Collect remaining child nodes to move into the body
    const bodyChildren = Array.from(this.childNodes);

    // Clear host content and build structure: .title, .close-button, .body
    this.innerHTML = '';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    titleDiv.innerHTML = titleContent;
    this.appendChild(titleDiv);

    const closeDiv = document.createElement('div');
    closeDiv.className = 'close-button';
    this.appendChild(closeDiv);

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'body';
    // move previously collected children into the body
    bodyChildren.forEach(n => bodyDiv.appendChild(n));
    this.appendChild(bodyDiv);
  }
}

customElements.define('app-box', AppBox);
