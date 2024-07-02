import React from "react";
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import CreateTask from "../../src/screens/Home/CreateTask";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../src/navigations/HomeStack";

type CreateTaskScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'CreateTask'>;

const mockNavigation: Partial<CreateTaskScreenNavigationProp> = {
    navigate: jest.fn(),
}

it('create task screen renders correctly', () => {
    let snapShot: ReactTestRendererJSON | ReactTestRendererJSON[] | null;
    snapShot = renderer.create(<CreateTask navigation={mockNavigation as CreateTaskScreenNavigationProp} />).toJSON();
    expect(snapShot).toMatchSnapshot();
})