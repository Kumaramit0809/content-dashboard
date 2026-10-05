import "@testing-library/jest-dom";
(global as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
