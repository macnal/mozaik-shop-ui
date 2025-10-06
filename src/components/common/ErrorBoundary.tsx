import * as React from 'react';
import {PropsWithChildren, ReactNode} from 'react';

export class ErrorBoundary extends React.Component<PropsWithChildren<{ fallback: ReactNode }>> {
  state: {
    hasError: boolean;
  }

  constructor(props: unknown) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: unknown) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch(error: unknown, info: unknown) {
    // logErrorToMyService(
    //   error,
    //   // Example "componentStack":
    //   //   in ComponentThatThrows (created by App)
    //   //   in ErrorBoundary (created by App)
    //   //   in div (created by App)
    //   //   in App
    //   info.componentStack,
    //   // Warning: `captureOwnerStack` is not available in production.
    //   React.captureOwnerStack(),
    // );
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
