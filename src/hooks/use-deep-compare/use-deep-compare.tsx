import {useEffect, useRef} from 'react';
import isobjectsEqual from '../../utilities/isObjectsEqual';

type EffectCallback = () => void | (() => void | undefined);
type DependencyList = ReadonlyArray<unknown>;
type Comparator = (a: DependencyList, b: DependencyList) => boolean;

function useDeepCompareRef(
  dependencies: DependencyList,
  comparator: Comparator = isobjectsEqual,
) {
  const dependencyList = useRef<DependencyList>(dependencies);

  if (!comparator(dependencyList.current, dependencies)) {
    dependencyList.current = dependencies;
  }

  return dependencyList.current;
}

function useDeepCompare(
  callback: EffectCallback,
  dependencies: DependencyList,
  customCompare?: Comparator,
) {
  useEffect(callback, useDeepCompareRef(dependencies, customCompare));
}

export default useDeepCompare;
