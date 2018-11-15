# slack-parse

Based on [**remark-parse**][remark-parse], modified to parse Slack's not-Markdown.

It assumes some simple transformations have been made beforehand, for sanity:

- converting Slack's special links into regular Markdown links according to Slack's [instructions](https://api.slack.com/docs/message-formatting#how_to_display_formatted_messages)
- since this means we'll be parsing regular Markdown link syntax, any square brackets in the actual message should be rendered as &lsqb; and &rsqb; beforehand
- as Slack returns angle brackets *not* involved in its link syntax as HTML entities, including those that are meant to be parsed as Markdown syntax, those should be decoded before parsing
- if an exclamation mark directly precedes a Slack link, it must be escaped, since otherwise the resulting Markdown syntax will look like an image
- however, since you can't escape characters in Slack (all backslashes are literal), all actual backslashes in the Slack text must be escaped

This is overly complex and hacky and on the whole this kind of sucks, but it works.

[remark-parse]: https://www.npmjs.com/package/remark-parse
