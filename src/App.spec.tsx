import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/App';
import { ThemeContext } from '@/hooks/theme.context';

vi.mock('@microsoft/fabric-visuals', () => ({
  VegaVisual: () => null,
  useCssTheme: () => ({}),
}));

vi.mock('@microsoft/fabric-datagrid', () => ({
  DataGrid: () => null,
}));

vi.mock('@/hooks/use-semantic-model-query', () => ({
  useSemanticModelQuery: () => ({
    data: {
      status: 'success',
      table: { columns: [], rows: [[148, 252, 6, 72]] },
    },
    isLoading: false,
    error: undefined,
    refetch: async () => {},
  }),
}));

describe('App', () => {
  it('renders Migration Pulse on the home route', async () => {
    render(
      <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
        <App />
      </ThemeContext.Provider>,
    );
    expect(
      await screen.findByRole('heading', { name: /Migration Pulse/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Live semantic model · Demo SM/i)).toBeInTheDocument();
    expect(screen.getByText(/Adoption trend/i)).toBeInTheDocument();
    expect(screen.getByText(/Channel mix/i)).toBeInTheDocument();
    expect(screen.getByText(/Team readiness heatmap/i)).toBeInTheDocument();
    expect(screen.getByText(/Migration backlog/i)).toBeInTheDocument();
    expect(screen.queryByText(/Backlog by risk/i)).not.toBeInTheDocument();
  });
});
