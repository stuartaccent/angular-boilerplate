import { computed, Directive, HostBinding, Input, signal } from '@angular/core';
import { Paths } from '@modules/shared/types/path';
import { uniq } from 'lodash';
import { styles } from '../../../app.styles';

export type StylePaths = Paths<typeof styles>;

@Directive({
  selector: '[appTailwind]',
  standalone: true
})
export class TailwindDirective {
  private path = signal<string[]>([]);
  private extraStyles = signal<string[]>([]);
  private all = computed(() => {
    const path = this.path();
    switch (path.length) {
      case 1: {
        const style = styles[path[0] as keyof typeof styles];
        return uniq([
          ...style.default,
          ...this.extraStyles(),
        ]);
      }
      case 2: {
        const style = styles[path[0] as keyof typeof styles];
        return uniq([
          ...style.default,
          ...style[path[1] as keyof typeof style],
          ...this.extraStyles(),
        ]);
      }
      default:
        return [];
    }
  });

  get appTailwind(): string {
    return this.all().join(' ');
  }

  @HostBinding('class')
  @Input({ required: true })
  set appTailwind(path: StylePaths) {
    this.path.set(path.split('.'));
  }

  @Input()
  set extra(styles: string[]) {
    this.extraStyles.set(styles);
  }
}
