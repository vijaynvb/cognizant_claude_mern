/**
 * Component Preview Page
 *
 * A page to showcase and test UI components.
 * Displays the Button component with all its variants and sizes.
 */

import React, { useState } from 'react';
import Button from '../components/ui/Button';
import '../styles/theme.css';

function ComponentPreview() {
  const [clickCount, setClickCount] = useState(0);

  /**
   * Handle button click
   */
  const handleClick = () => {
    setClickCount(prevCount => prevCount + 1);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">UI Component Preview</h1>

      {/* Click Counter */}
      <div className="alert alert-info mb-5">
        <strong>Click Counter:</strong> {clickCount} clicks
      </div>

      {/* Button Variants Section */}
      <section className="mb-5">
        <h2 className="h3 mb-3">Button Variants</h2>
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Button variant="primary" onClick={handleClick}>
            Primary
          </Button>
          <Button variant="secondary" onClick={handleClick}>
            Secondary
          </Button>
          <Button variant="success" onClick={handleClick}>
            Success
          </Button>
          <Button variant="danger" onClick={handleClick}>
            Danger
          </Button>
          <Button variant="warning" onClick={handleClick}>
            Warning
          </Button>
          <Button variant="info" onClick={handleClick}>
            Info
          </Button>
          <Button variant="light" onClick={handleClick}>
            Light
          </Button>
          <Button variant="dark" onClick={handleClick}>
            Dark
          </Button>
        </div>
      </section>

      {/* Button Sizes Section */}
      <section className="mb-5">
        <h2 className="h3 mb-3">Button Sizes</h2>
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Button size="small" onClick={handleClick}>
            Small Button
          </Button>
          <Button size="medium" onClick={handleClick}>
            Medium Button
          </Button>
          <Button size="large" onClick={handleClick}>
            Large Button
          </Button>
        </div>
      </section>

      {/* Disabled State Section */}
      <section className="mb-5">
        <h2 className="h3 mb-3">Disabled State</h2>
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Button variant="primary" disabled>
            Disabled Primary
          </Button>
          <Button variant="secondary" disabled>
            Disabled Secondary
          </Button>
          <Button variant="success" disabled>
            Disabled Success
          </Button>
        </div>
      </section>

      {/* Full Width Section */}
      <section className="mb-5">
        <h2 className="h3 mb-3">Full Width Button</h2>
        <Button variant="primary" fullWidth onClick={handleClick}>
          Full Width Button
        </Button>
      </section>

      {/* Default "Click Me" Button */}
      <section className="mb-5">
        <h2 className="h3 mb-3">Default Button</h2>
        <p className="text-muted mb-3">
          Button with default props (text: "Click Me", variant: "primary", size: "medium")
        </p>
        <Button onClick={handleClick} />
      </section>

      {/* Combined Variants Section */}
      <section className="mb-5">
        <h2 className="h3 mb-3">Size and Variant Combinations</h2>
        <div className="row g-3">
          <div className="col-12">
            <h4 className="h5">Small Buttons</h4>
            <div className="d-flex flex-wrap gap-2">
              <Button variant="primary" size="small" onClick={handleClick}>
                Small Primary
              </Button>
              <Button variant="success" size="small" onClick={handleClick}>
                Small Success
              </Button>
              <Button variant="danger" size="small" onClick={handleClick}>
                Small Danger
              </Button>
            </div>
          </div>
          <div className="col-12">
            <h4 className="h5">Large Buttons</h4>
            <div className="d-flex flex-wrap gap-2">
              <Button variant="primary" size="large" onClick={handleClick}>
                Large Primary
              </Button>
              <Button variant="success" size="large" onClick={handleClick}>
                Large Success
              </Button>
              <Button variant="danger" size="large" onClick={handleClick}>
                Large Danger
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Button Types Section */}
      <section className="mb-5">
        <h2 className="h3 mb-3">Button Types</h2>
        <form onSubmit={(e) => { e.preventDefault(); alert('Form submitted!'); }}>
          <div className="d-flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={handleClick}>
              Type: Button
            </Button>
            <Button type="submit" variant="primary">
              Type: Submit
            </Button>
            <Button type="reset" variant="danger">
              Type: Reset
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ComponentPreview;
