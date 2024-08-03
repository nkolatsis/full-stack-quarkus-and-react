import { render, screen } from "@testing-library/react";
import {CompleteChip} from './CompleteChip';

describe("CompleteChip component test", () => {
  test('no task, not visible', () => {
    const {container} = render(<CompleteChip />);
    expect(container).toBeEmptyDOMElement();
  });
  test('incomplete task, not visible', () => {
    const {container} = render(<CompleteChip task={{title: 'title'}} />);
    expect(container).toBeEmptyDOMElement();
  });
  test('complete task, shows date', () => {
    const {container} = render(<CompleteChip task={{complete: '2015-10-21T04:29:00.000Z'}}/>);
    expect(container).not.toBeEmptyDOMElement();
    expect(screen.getByText(/2015/)).toBeInTheDocument();
    expect(screen.getByTestId('complete-chip')).toHaveClass('MuiChip-colorSuccess');
  });
});