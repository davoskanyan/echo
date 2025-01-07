import { WebClient } from '@slack/web-api';

const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;

export const slackClient = new WebClient(SLACK_TOKEN);
