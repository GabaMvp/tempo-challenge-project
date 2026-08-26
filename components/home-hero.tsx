import type {ReactElement} from 'react';
import {fetchContent} from '@croct/plug-next/server';

export default async function HomeHero(): Promise<ReactElement> {
  const {content} = await fetchContent('home-hero@1');

  return (
    <ul>
      <li><strong>Tagline:</strong> {content.tagline}</li>
      <li><strong>Title:</strong> {content.title}</li>
      <li><strong>Description:</strong> {content.description}</li>
      <li>
        <strong>Primary CTA</strong>
        <ul>
          <li><strong>Label:</strong> {content.primaryCta.label}</li>
          <li><strong>URL:</strong> {content.primaryCta.url}</li>
        </ul>
      </li>
      <li>
        <strong>Secondary CTA</strong>
        <ul>
          <li><strong>Label:</strong> {content.secondaryCta?.label}</li>
          <li><strong>URL:</strong> {content.secondaryCta?.url}</li>
        </ul>
      </li>
      <li><strong>Details:</strong> {content.details}</li>
    </ul>
  );
};
