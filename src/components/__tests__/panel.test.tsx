import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Panel, PanelBody } from '../panel'

describe('Panel', () => {
  it('renders children', async () => {
    render(
      <Panel>
        <div>Panel content</div>
      </Panel>,
    )

    await expect.element(page.getByText('Panel content')).toBeInTheDocument()
  })

  it('applies panel class', async () => {
    render(<Panel data-testid="panel">Content</Panel>)
    const panel = page.getByTestId('panel')

    await expect.element(panel).toHaveAttribute('class', expect.stringContaining('panel'))
  })

  it('accepts custom className', async () => {
    render(
      <Panel className="custom-panel" data-testid="panel">
        Content
      </Panel>,
    )
    const panel = page.getByTestId('panel')

    await expect.element(panel).toHaveAttribute('class', expect.stringContaining('panel'))
    await expect.element(panel).toHaveAttribute('class', expect.stringContaining('custom-panel'))
  })

  it('forwards other div props', async () => {
    render(
      <Panel data-testid="panel" aria-label="Test panel" id="test-panel">
        Content
      </Panel>,
    )
    const panel = page.getByTestId('panel')

    await expect.element(panel).toHaveAttribute('aria-label', 'Test panel')
    await expect.element(panel).toHaveAttribute('id', 'test-panel')
  })

  it('renders as a div element', async () => {
    render(<Panel data-testid="panel">Content</Panel>)
    const panel = page.getByTestId('panel')

    expect((await panel.element()).tagName).toBe('DIV')
  })

  it('renders with nested PanelBody', async () => {
    render(
      <Panel data-testid="panel">
        <PanelBody>
          <p>Body content</p>
        </PanelBody>
      </Panel>,
    )

    await expect.element(page.getByTestId('panel')).toBeInTheDocument()
    await expect.element(page.getByText('Body content')).toBeInTheDocument()
  })
})

describe('PanelBody', () => {
  it('renders children', async () => {
    render(
      <PanelBody>
        <div>Body content</div>
      </PanelBody>,
    )

    await expect.element(page.getByText('Body content')).toBeInTheDocument()
  })

  it('applies panel-body class', async () => {
    render(<PanelBody data-testid="panel-body">Content</PanelBody>)
    const panelBody = page.getByTestId('panel-body')

    await expect.element(panelBody).toHaveAttribute('class', expect.stringContaining('panel-body'))
  })

  it('accepts custom className', async () => {
    render(
      <PanelBody className="custom-body" data-testid="panel-body">
        Content
      </PanelBody>,
    )
    const panelBody = page.getByTestId('panel-body')

    await expect.element(panelBody).toHaveAttribute('class', expect.stringContaining('panel-body'))
    await expect.element(panelBody).toHaveAttribute('class', expect.stringContaining('custom-body'))
  })

  it('forwards other div props', async () => {
    render(
      <PanelBody data-testid="panel-body" role="region" aria-labelledby="heading">
        Content
      </PanelBody>,
    )
    const panelBody = page.getByTestId('panel-body')

    await expect.element(panelBody).toHaveAttribute('role', 'region')
    await expect.element(panelBody).toHaveAttribute('aria-labelledby', 'heading')
  })

  it('renders as a div element', async () => {
    render(<PanelBody data-testid="panel-body">Content</PanelBody>)
    const panelBody = page.getByTestId('panel-body')

    expect((await panelBody.element()).tagName).toBe('DIV')
  })

  it('renders multiple children', async () => {
    render(
      <PanelBody>
        <h2>Title</h2>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </PanelBody>,
    )

    await expect.element(page.getByText('Title')).toBeInTheDocument()
    await expect.element(page.getByText('Paragraph 1')).toBeInTheDocument()
    await expect.element(page.getByText('Paragraph 2')).toBeInTheDocument()
  })
})
