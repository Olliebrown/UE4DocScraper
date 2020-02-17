import path from 'path'

// Different doc paths
const baseDir = path.join(__dirname, '..')
const paths = [
    path.join(baseDir, 'UE4Cpp', 'docs.unrealengine.com_443'),
    path.join(baseDir, 'UE4Blueprint', 'docs.unrealengine.com_443'),
    path.join(baseDir, 'UE4Engine', 'docs.unrealengine.com_443'),
    path.join(baseDir, 'UE4Editor', 'docs.unrealengine.com_443'),
    path.join(baseDir, 'UE4Guides', 'docs.unrealengine.com_443'),
    path.join(baseDir, 'UE4Other', 'docs.unrealengine.com_443')
]

export function getPaths() {
    return paths
}
