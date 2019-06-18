import React from 'react';
import {unstyled} from '../shared';
import usePolaris from '../../utilities/use-polaris';
import {UnstyledLinkProps} from '../../utilities/unstyled-link';

interface Props extends UnstyledLinkProps {}

export default React.memo(function UnstyledLink(props: Props) {
  const polaris = usePolaris();
  if (polaris && polaris.link) {
    const LinkComponent = polaris.link.getLinkComponent();
    if (LinkComponent) {
      return <LinkComponent {...unstyled.props} {...props} />;
    }
  }

  const {external, url, ...rest} = props;
  const target = external ? '_blank' : undefined;
  const rel = external ? 'noopener noreferrer' : undefined;
  return (
    <a target={target} {...rest} href={url} rel={rel} {...unstyled.props} />
  );
});
