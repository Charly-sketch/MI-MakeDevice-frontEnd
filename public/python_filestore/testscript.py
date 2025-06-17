from gerbonara import LayerStack
stack1 = LayerStack.open('/gerberExample1/')
w1, h1 = stack1.outline.size('mm')
print(f'Board size is {w1:.1f} mm x {h1:.1f} mm')