


# Testing

READ THIS: https://www.robinwieruch.de/react-testing-library/


### General
expect(container).not.toBeEmptyDOMElement(); # not  
expect(screen.getByText(/2015/)).toBeInTheDocument(); # screen  

### Jest functions
.toBeEmptyDOMElement()  
.toHaveClass  

### React Testing Library

render( \<CompleteChip /\>)  
screen.getByText(/2015/)  
screen.getByTestId('complete-chip')  