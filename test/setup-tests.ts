import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import * as Enzyme from 'enzyme';
// @ts-ignore
import EnzymeAdapter from 'enzyme-adapter-react-16';

Enzyme.configure({
  adapter: new EnzymeAdapter(),
});