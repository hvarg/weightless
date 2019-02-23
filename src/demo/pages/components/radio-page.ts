import { customElement, html, LitElement } from "lit-element";
import "../../code-example/code-example-element";
import "../../demo/demo-element";
import { sharedStyles } from "../../style/shared";
import "./../../../lib/card/card-element";
import "./../../../lib/checkbox/checkbox-element";
import "./../../../lib/radio/radio-element";
import "./../../../lib/title/title-element";

@customElement("radio-page")
export default class RadioPage extends LitElement {

	static styles = [sharedStyles];

	protected render () {
		return html`
			<demo-element default>
				<code-example-element>
					<radio-element name="food" value="salad"></radio-element>
					<radio-element name="food" value="burger"></radio-element>
					<radio-element name="food" value="pizza"></radio-element>
				</code-example-element>
			</demo-element>
			
			<title-element level="3">Disabled</title-element>
			<demo-element>
				<code-example-element>
					<radio-element disabled></radio-element>
					<radio-element checked disabled></radio-element>
				</code-example-element>
			</demo-element>
		`;
	}
}