function quote(value) {
  const text = String(value ?? '');
  return JSON.stringify(text);
}

function scalar(value) {
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (value === null || value === undefined) return '""';
  return quote(value);
}

function emit(value, indent = 0) {
  const prefix = ' '.repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) return `${prefix}[]`;
    return value
      .map((item) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const nested = emit(item, indent + 2).split('\n');
          return `${prefix}- ${nested[0].trimStart()}${nested.slice(1).length ? `\n${nested.slice(1).join('\n')}` : ''}`;
        }
        return `${prefix}- ${scalar(item)}`;
      })
      .join('\n');
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return `${prefix}{}`;
    return entries
      .map(([key, child]) => {
        if (Array.isArray(child)) {
          if (child.length === 0) return `${prefix}${key}: []`;
          return `${prefix}${key}:\n${emit(child, indent + 2)}`;
        }
        if (child && typeof child === 'object') {
          return `${prefix}${key}:\n${emit(child, indent + 2)}`;
        }
        return `${prefix}${key}: ${scalar(child)}`;
      })
      .join('\n');
  }

  return `${prefix}${scalar(value)}`;
}

function stripQuotes(value) {
  const text = value.trim();
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.slice(1, -1);
  }
  return text;
}

function stripInlineComment(value) {
  // Strip inline comments: "active  # planning | active" → "active"
  // But preserve # inside quoted strings
  const text = value.trim();
  if (text.startsWith('"') || text.startsWith("'")) return text;
  const hashIndex = text.indexOf('#');
  if (hashIndex === -1) return text;
  return text.slice(0, hashIndex).trim();
}

function parseScalar(value) {
  const text = stripInlineComment(value);
  if (text === '[]') return [];
  if (text === '{}') return {};
  if (text === 'true') return true;
  if (text === 'false') return false;
  if (text === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  return stripQuotes(text);
}

function indentOf(line) {
  return line.match(/^\s*/)[0].length;
}

function nextMeaningfulLine(lines, index) {
  let cursor = index;
  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line.trim() !== '' && !line.trimStart().startsWith('#')) return cursor;
    cursor += 1;
  }
  return cursor;
}

function parseBlock(lines, startIndex, indent) {
  let index = nextMeaningfulLine(lines, startIndex);
  if (index >= lines.length) return { value: {}, nextIndex: index };

  const firstLine = lines[index];
  if (indentOf(firstLine) < indent) return { value: {}, nextIndex: index };

  if (firstLine.slice(indent).startsWith('- ')) {
    const items = [];
    while (index < lines.length) {
      index = nextMeaningfulLine(lines, index);
      if (index >= lines.length) break;
      const line = lines[index];
      const currentIndent = indentOf(line);
      if (currentIndent < indent || !line.slice(indent).startsWith('- ')) break;

      const content = line.slice(indent + 2);
      if (content.includes(':')) {
        const [firstKey, ...rest] = content.split(':');
        const firstValue = rest.join(':').trim();
        const object = {};

        if (firstValue === '') {
          const nested = parseBlock(lines, index + 1, indent + 4);
          object[firstKey.trim()] = nested.value;
          index = nested.nextIndex;
        } else {
          object[firstKey.trim()] = parseScalar(firstValue);
          index += 1;
        }

        while (index < lines.length) {
          const nestedIndex = nextMeaningfulLine(lines, index);
          if (nestedIndex >= lines.length) {
            index = nestedIndex;
            break;
          }
          const nestedLine = lines[nestedIndex];
          const nestedIndent = indentOf(nestedLine);
          if (nestedIndent < indent + 2) {
            index = nestedIndex;
            break;
          }
          if (nestedLine.slice(indent + 2).startsWith('- ')) {
            index = nestedIndex;
            break;
          }
          const trimmed = nestedLine.trim();
          const colonIndex = trimmed.indexOf(':');
          const key = trimmed.slice(0, colonIndex).trim();
          const rawValue = trimmed.slice(colonIndex + 1).trim();
          if (rawValue === '') {
            const nested = parseBlock(lines, nestedIndex + 1, nestedIndent + 2);
            object[key] = nested.value;
            index = nested.nextIndex;
          } else {
            object[key] = parseScalar(rawValue);
            index = nestedIndex + 1;
          }
        }

        items.push(object);
        continue;
      }

      items.push(parseScalar(content));
      index += 1;
    }
    return { value: items, nextIndex: index };
  }

  const object = {};
  while (index < lines.length) {
    index = nextMeaningfulLine(lines, index);
    if (index >= lines.length) break;
    const line = lines[index];
    const currentIndent = indentOf(line);
    if (currentIndent < indent) break;
    if (currentIndent > indent) {
      index += 1;
      continue;
    }
    const trimmed = line.trim();
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) {
      index += 1;
      continue;
    }
    const key = trimmed.slice(0, colonIndex).trim();
    const rawValue = trimmed.slice(colonIndex + 1).trim();
    if (rawValue === '') {
      const nested = parseBlock(lines, index + 1, indent + 2);
      object[key] = nested.value;
      index = nested.nextIndex;
    } else {
      object[key] = parseScalar(rawValue);
      index += 1;
    }
  }

  return { value: object, nextIndex: index };
}

export function toYaml(value) {
  return `${emit(value)}\n`;
}

export function fromYaml(text) {
  const lines = text.split(/\r?\n/);
  return parseBlock(lines, 0, 0).value;
}
