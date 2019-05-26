---
name: List filters
category: Lists and tables
keywords:
  - DataTable
  - data
  - table
  - tabular
  - index
---

# List filters

List filters is a composite component that filters the resource list component.

---

## Examples

### Basic resource list without the save flow

```jsx
class ListFiltersExample extends React.Component {
  render() {
    const filters = [
      {
        key: 'foo',
        label: 'Foo',
        filter: <Button>Hello</Button>,
        shortcut: true,
      },
      {
        key: 'bar',
        label: 'Bar',
        filter: <Button>World</Button>,
        shortcut: true,
      },
      {
        key: 'baz',
        label: 'Baz',
        filter: <Button>!</Button>,
      },
    ];

    return (
      <Frame>
        <Page title="Orders">
          <ListFilters
            filters={filters}
            onQueryChange={() => null}
            onQueryClear={() => null}
          />
        </Page>
      </Frame>
    );
  }
}
```
