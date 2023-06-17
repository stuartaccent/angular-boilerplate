import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApolloError, ApolloQueryResult } from '@apollo/client/core';
import { ButtonDirective } from '@modules/shared/directives/button.directive';
import { Apollo, gql, QueryRef } from 'apollo-angular';

enum FilterOperator {
  AND = 'AND',
  OR = 'OR',
}

interface DateFilter {
  eq?: string;
  neq?: string;
  lte?: string;
  gte?: string;
  null?: boolean;
  op?: FilterOperator;
  chained?: DateFilter[];
}

interface DateTimeFilter {
  eq?: string;
  neq?: string;
  lte?: string;
  gte?: string;
  null?: boolean;
  op?: FilterOperator;
  chained?: DateTimeFilter[];
}

interface NumberFilter {
  eq?: number;
  neq?: number;
  lte?: number;
  gte?: number;
  null?: boolean;
  op?: FilterOperator;
  chained?: NumberFilter[];
}

interface StringFilter {
  eq?: string;
  neq?: string;
  like?: string;
  ilike?: string;
  null?: boolean;
  op?: FilterOperator;
  chained?: StringFilter[];
}

interface PersonFilter {
  id?: StringFilter;
  name?: StringFilter;
}

interface Person {
  id: string;
  name: string;
  species: {
    id: string;
    name: string
  };
  homeworld: {
    id: string;
    name: string;
  }
}

interface PersonResult {
  getAllPeople: {
    items: Person[];
    items_count: number;
    total_count: number;
  }
}

interface Pagination {
  offset: number;
  limit: number;
}

const PERSONS_ALL = gql`
  query GetQuery($pagination: Pagination, $filters: PersonFilter) {
    getAllPeople(pagination: $pagination, filters: $filters) {
      items {
        id
        name
        species {
          id
          name
        }
        homeworld {
          id
          name
        }
      }
      items_count
      total_count
    }
  }
`;

@Component({
  selector: 'app-person-graph',
  standalone: true,
  imports: [
    CommonModule,
    ButtonDirective,
  ],
  templateUrl: './person-graph.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonGraphComponent {
  pagination: WritableSignal<Pagination> = signal<Pagination>({
    offset: 0,
    limit: 2,
  });
  filters: WritableSignal<PersonFilter> = signal<PersonFilter>({
    name: {
      op: FilterOperator.OR,
      chained: [{ ilike: 'r2' }, { ilike: '3po' }]
    },
  });
  result: Signal<ApolloQueryResult<PersonResult> | null>;
  data: Signal<PersonResult | null> = computed(() => this.result()?.data ?? null);
  loading: Signal<boolean> = computed(() => this.result()?.loading ?? false);
  error: Signal<ApolloError | null> = computed(() => this.result()?.error ?? null);

  private apollo = inject(Apollo);
  private query: QueryRef<PersonResult>;

  constructor() {
    const pagination = this.pagination();
    const filters = this.filters();
    this.query = this.apollo
      .watchQuery<PersonResult>({
        query: PERSONS_ALL,
        variables: { pagination, filters },
      });
    this.result = toSignal(this.query.valueChanges, { initialValue: null });

    effect(() => {
      const pagination = this.pagination();
      this.query.refetch({ pagination }).catch((error) => console.error(error));
    });
  }

  prevOffset() {
    const p = this.pagination();
    this.setPagination('offset', Math.max((p.offset -= p.limit), 0));
  }

  nextOffset() {
    const p = this.pagination();
    this.setPagination('offset', (p.offset += p.limit));
  }

  decLimit() {
    const p = this.pagination();
    this.setPagination('limit', Math.max((p.limit -= 1), 1));
  }

  incLimit() {
    const p = this.pagination();
    this.setPagination('limit', (p.limit += 1));
  }

  private setPagination(key: keyof Pagination, value: number) {
    this.pagination.mutate((p) => p[key] = value);
  }
}
