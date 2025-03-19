import React from 'react';
import styled from 'styled-components';
import { Card } from '../components/common/Card';

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  ul, ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
`;

export const About = () => {
  return (
    <div>
      <PageHeader>
        <h1>About the Tournament</h1>
        <p>Rules, guidelines, and information about the dart tournament</p>
      </PageHeader>
      
      <Card>
        <Section>
          <h2>Tournament Overview</h2>
          <p>
            Welcome to our Dart Tournament! This is a round-robin style competition where players are
            ranked on a leaderboard based on their performance. Each week, you'll be assigned a matchup
            against another player. Your goal is to win as many matches as possible to climb the rankings.
          </p>
        </Section>
        
        <Section>
          <h2>Match Rules</h2>
          <ol>
            <li>
              <strong>Game Format:</strong> Each match consists of best-of-3 games of 501.
            </li>
            <li>
              <strong>Starting:</strong> Standard straight-in, double-out rules.
            </li>
            <li>
              <strong>Scheduling:</strong> Players have one week to complete their scheduled match.
            </li>
            <li>
              <strong>Reporting:</strong> Both players must confirm the match result in the system.
            </li>
            <li>
              <strong>Disputes:</strong> Any disputes will be resolved by the tournament administrator.
            </li>
          </ol>
        </Section>
        
        <Section>
          <h2>Ranking System</h2>
          <p>
            Rankings are determined primarily by win-loss record. In case of ties, the following
            tiebreakers will be applied in order:
          </p>
          <ol>
            <li>Head-to-head record</li>
            <li>Number of 180s thrown during the tournament</li>
            <li>Average score per turn</li>
          </ol>
          <p>
            Rankings are updated weekly after all matches are completed.
          </p>
        </Section>
        
        <Section>
          <h2>Code of Conduct</h2>
          <p>
            All participants are expected to:
          </p>
          <ul>
            <li>Show good sportsmanship and respect for opponents</li>
            <li>Complete matches within the scheduled timeframe</li>
            <li>Report scores accurately and honestly</li>
            <li>Communicate promptly regarding scheduling</li>
            <li>Follow all tournament rules and guidelines</li>
          </ul>
          <p>
            Violations of the code of conduct may result in warnings, match forfeiture, or
            disqualification from the tournament.
          </p>
        </Section>
        
        <Section>
          <h2>Contact Information</h2>
          <p>
            If you have any questions or issues regarding the tournament, please contact the
            tournament administrator:
          </p>
          <p>
            <strong>Email:</strong> admin@example.com<br />
            <strong>Phone:</strong> 123-456-7890
          </p>
        </Section>
      </Card>
    </div>
  );
};