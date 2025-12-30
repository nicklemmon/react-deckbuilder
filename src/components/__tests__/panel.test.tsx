import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Panel, PanelBody } from '../panel'

describe('Panel', () => {
  it('renders children', () => {
    render(
      <Panel>
        <div>Panel content</div>
      </Panel>,
    )

    expect(screen.getByText('Panel content')).toBeInTheDocument()
  })

  it('applies panel class', () => {
    render(<Panel data-testid="panel">Content</Panel>)
    const panel = screen.getByTestId('panel')

    expect(panel.className).toContain('panel')
  })

  it('accepts custom className', () => {
    render(
      <Panel className="custom-panel" data-testid="panel">
        Content
      </Panel>,
    )
    const panel = screen.getByTestId('panel')

    expect(panel.className).toContain('panel')
    expect(panel.className).toContain('custom-panel')
  })

  it('forwards other div props', () => {
    render(
      <Panel data-testid="panel" aria-label="Test panel" id="test-panel">
        Content
      </Panel>,
    )
    const panel = screen.getByTestId('panel')

    expect(panel).toHaveAttribute('aria-label', 'Test panel')
    expect(panel).toHaveAttribute('id', 'test-panel')
  })

  it('renders as a div element', () => {
    render(<Panel data-testid="panel">Content</Panel>)
    const panel = screen.getByTestId('panel')

    expect(panel.tagName).toBe('DIV')
  })

  it('renders with nested PanelBody', () => {
    render(
      <Panel data-testid="panel">
        <PanelBody>
          <p>Body content</p>
        </PanelBody>
      </Panel>,
    )

    expect(screen.getByTestId('panel')).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })
})

describe('PanelBody', () => {
  it('renders children', () => {
    render(
      <PanelBody>
        <div>Body content</div>
      </PanelBody>,
    )

    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('applies panel-body class', () => {
    render(<PanelBody data-testid="panel-body">Content</PanelBody>)
    const panelBody = screen.getByTestId('panel-body')

    expect(panelBody.className).toContain('panel-body')
  })

  it('accepts custom className', () => {
    render(
      <PanelBody className="custom-body" data-testid="panel-body">
        Content
      </PanelBody>,
    )
    const panelBody = screen.getByTestId('panel-body')

    expect(panelBody.className).toContain('panel-body')
    expect(panelBody.className).toContain('custom-body')
  })

  it('forwards other div props', () => {
    render(
      <PanelBody data-testid="panel-body" role="region" aria-labelledby="heading">
        Content
      </PanelBody>,
    )
    const panelBody = screen.getByTestId('panel-body')

    expect(panelBody).toHaveAttribute('role', 'region')
    expect(panelBody).toHaveAttribute('aria-labelledby', 'heading')
  })

  it('renders as a div element', () => {
    render(<PanelBody data-testid="panel-body">Content</PanelBody>)
    const panelBody = screen.getByTestId('panel-body')

    expect(panelBody.tagName).toBe('DIV')
  })

  it('renders multiple children', () => {
    render(
      <PanelBody>
        <h2>Title</h2>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </PanelBody>,
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
  })
})
