import { css } from "lit";

export const styles = css`
  :host {
    display: none; /* Hidden by default */
    position: fixed;
    top: 70px;
    right: 0px;
    width: 220px;
    background: #ffffff;
    opacity: 1;
    padding: 20px 20px;
    box-sizing: border-box;
    transform: translateX(100%);
    transition: transform 250ms ease-in;
  }

  :host([dark_mode]) {
    background: #23252a;
  }

  :host([visible]) {
    transform: translateX(0);
  }

  :host(.ready) {
    display: block; /* Show when ready */
  }

  :host(.no-transition) {
    transition: none;
  }
`