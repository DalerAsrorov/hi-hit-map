const SMTree = {
    data: {
        type: 'RootNode',
        children: [
            {
                type: 'ParagraphNode',
                children: [
                    {
                        type: 'SentenceNode',
                        children: [
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'I',
                                        position: {
                                            start: { line: 1, column: 1, offset: 0 },
                                            end: { line: 1, column: 2, offset: 1 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 1, offset: 0 },
                                    end: { line: 1, column: 2, offset: 1 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 2, offset: 1 },
                                    end: { line: 1, column: 3, offset: 2 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'hate',
                                        position: {
                                            start: { line: 1, column: 3, offset: 2 },
                                            end: { line: 1, column: 7, offset: 6 }
                                        },
                                        data: { polarity: -3, valence: 'negative' }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 3, offset: 2 },
                                    end: { line: 1, column: 7, offset: 6 }
                                },
                                data: { polarity: -3, valence: 'negative' }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 7, offset: 6 },
                                    end: { line: 1, column: 8, offset: 7 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'forgetting',
                                        position: {
                                            start: { line: 1, column: 8, offset: 7 },
                                            end: { line: 1, column: 18, offset: 17 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 8, offset: 7 },
                                    end: { line: 1, column: 18, offset: 17 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 18, offset: 17 },
                                    end: { line: 1, column: 19, offset: 18 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'to',
                                        position: {
                                            start: { line: 1, column: 19, offset: 18 },
                                            end: { line: 1, column: 21, offset: 20 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 19, offset: 18 },
                                    end: { line: 1, column: 21, offset: 20 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 21, offset: 20 },
                                    end: { line: 1, column: 22, offset: 21 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'bring',
                                        position: {
                                            start: { line: 1, column: 22, offset: 21 },
                                            end: { line: 1, column: 27, offset: 26 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 22, offset: 21 },
                                    end: { line: 1, column: 27, offset: 26 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 27, offset: 26 },
                                    end: { line: 1, column: 28, offset: 27 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'a',
                                        position: {
                                            start: { line: 1, column: 28, offset: 27 },
                                            end: { line: 1, column: 29, offset: 28 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 28, offset: 27 },
                                    end: { line: 1, column: 29, offset: 28 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 29, offset: 28 },
                                    end: { line: 1, column: 30, offset: 29 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'book',
                                        position: {
                                            start: { line: 1, column: 30, offset: 29 },
                                            end: { line: 1, column: 34, offset: 33 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 30, offset: 29 },
                                    end: { line: 1, column: 34, offset: 33 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 34, offset: 33 },
                                    end: { line: 1, column: 35, offset: 34 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'somewhere',
                                        position: {
                                            start: { line: 1, column: 35, offset: 34 },
                                            end: { line: 1, column: 44, offset: 43 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 35, offset: 34 },
                                    end: { line: 1, column: 44, offset: 43 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 44, offset: 43 },
                                    end: { line: 1, column: 45, offset: 44 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'I',
                                        position: {
                                            start: { line: 1, column: 45, offset: 44 },
                                            end: { line: 1, column: 46, offset: 45 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 45, offset: 44 },
                                    end: { line: 1, column: 46, offset: 45 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 46, offset: 45 },
                                    end: { line: 1, column: 47, offset: 46 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'definitely',
                                        position: {
                                            start: { line: 1, column: 47, offset: 46 },
                                            end: { line: 1, column: 57, offset: 56 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 47, offset: 46 },
                                    end: { line: 1, column: 57, offset: 56 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 57, offset: 56 },
                                    end: { line: 1, column: 58, offset: 57 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'should',
                                        position: {
                                            start: { line: 1, column: 58, offset: 57 },
                                            end: { line: 1, column: 64, offset: 63 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 58, offset: 57 },
                                    end: { line: 1, column: 64, offset: 63 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 64, offset: 63 },
                                    end: { line: 1, column: 65, offset: 64 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'have',
                                        position: {
                                            start: { line: 1, column: 65, offset: 64 },
                                            end: { line: 1, column: 69, offset: 68 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 65, offset: 64 },
                                    end: { line: 1, column: 69, offset: 68 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 69, offset: 68 },
                                    end: { line: 1, column: 70, offset: 69 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'brought',
                                        position: {
                                            start: { line: 1, column: 70, offset: 69 },
                                            end: { line: 1, column: 77, offset: 76 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 70, offset: 69 },
                                    end: { line: 1, column: 77, offset: 76 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 77, offset: 76 },
                                    end: { line: 1, column: 78, offset: 77 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'a',
                                        position: {
                                            start: { line: 1, column: 78, offset: 77 },
                                            end: { line: 1, column: 79, offset: 78 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 78, offset: 77 },
                                    end: { line: 1, column: 79, offset: 78 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 79, offset: 78 },
                                    end: { line: 1, column: 80, offset: 79 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'book',
                                        position: {
                                            start: { line: 1, column: 80, offset: 79 },
                                            end: { line: 1, column: 84, offset: 83 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 80, offset: 79 },
                                    end: { line: 1, column: 84, offset: 83 }
                                }
                            },
                            {
                                type: 'WhiteSpaceNode',
                                value: ' ',
                                position: {
                                    start: { line: 1, column: 84, offset: 83 },
                                    end: { line: 1, column: 85, offset: 84 }
                                }
                            },
                            {
                                type: 'WordNode',
                                children: [
                                    {
                                        type: 'TextNode',
                                        value: 'to',
                                        position: {
                                            start: { line: 1, column: 85, offset: 84 },
                                            end: { line: 1, column: 87, offset: 86 }
                                        }
                                    }
                                ],
                                position: {
                                    start: { line: 1, column: 85, offset: 84 },
                                    end: { line: 1, column: 87, offset: 86 }
                                }
                            },
                            {
                                type: 'PunctuationNode',
                                value: '.',
                                position: {
                                    start: { line: 1, column: 87, offset: 86 },
                                    end: { line: 1, column: 88, offset: 87 }
                                }
                            }
                        ],
                        position: {
                            start: { line: 1, column: 1, offset: 0 },
                            end: { line: 1, column: 88, offset: 87 }
                        },
                        data: { polarity: -3, valence: 'negative' }
                    }
                ],
                position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 88, offset: 87 } },
                data: { polarity: -3, valence: 'negative' }
            },
            {
                type: 'WhiteSpaceNode',
                value: ' ',
                position: { start: { line: 1, column: 88, offset: 87 }, end: { line: 1, column: 89, offset: 88 } }
            }
        ],
        position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 89, offset: 88 } },
        data: { polarity: -3, valence: 'negative' }
    },
    metadata: {
        params: {},
        time: { utc: 'Fri, 21 Apr 2017 23:13:40 GMT', local: '4/21/2017, 4:13:40 PM', seconds: 1492816420595 }
    }
};
const SMObject = SMTree.data;
let data = SMTree.data;
let rootChildren = data.children;
let childrenClone = rootChildren.slice(0);
