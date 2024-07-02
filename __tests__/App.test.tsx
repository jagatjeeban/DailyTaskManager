import React from "react";
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import App from "../App";

it('app test snapshot', () => {
    let snapShot: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer.create(<App />).toJSON();
    expect(snapShot).toMatchSnapshot();
})