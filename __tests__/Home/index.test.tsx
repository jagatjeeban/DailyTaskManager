import React from "react";
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import Home from "../../src/screens/Home";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../src/navigations/HomeStack";

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const mockNavigation: Partial<HomeScreenNavigationProp> = {
    navigate: jest.fn()
}

it('home renders correctly', () => {
    let snapShot: ReactTestRendererJSON | ReactTestRendererJSON[] | null;
    snapShot = renderer.create(<Home navigation={mockNavigation as HomeScreenNavigationProp} />).toJSON();
    expect(snapShot).toMatchSnapshot();
})